/*
 * Copyright (C) 2011 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Java.IO;
using Java.Lang.Reflect;
using Java.Net;
using Java.Util;
using Java.Util.Concurrent;
using Java.Lang;
using Android.Util;
using Android.Text;
using Java.Util.Concurrent.Locks;
using Android.Content.PM;
using System.IO;
using System.Reflection;

namespace Android.Debug.HV
{

    //namespace ChiKoja.ViewServer
    //{
    //    class ViewServer
    //    {
    //    }
    //}



 /**
 * <p>This class can be used to enable the use of HierarchyViewer inside an
 * application. HierarchyViewer is an Android SDK tool that can be used
 * to inspect and debug the user interface of running applications. For
 * security reasons, HierarchyViewer does not work on production builds
 * (for instance phones bought in store.) By using this class, you can
 * make HierarchyViewer work on any device. You must be very careful
 * however to only enable HierarchyViewer when debugging your
 * application.</p>
 * 
 * <p>To use this view server, your application must require the INTERNET
 * permission.</p>
 * 
 * <p>The recommended way to use this API is to register activities when
 * they are created, and to unregister them when they get destroyed:</p>
 * 
 * <pre>
 * public class MyActivity extends Activity {
 *     public void onCreate(Bundle savedInstanceState) {
 *         super.onCreate(savedInstanceState);
 *         // Set content view, etc.
 *         ViewServer.get(this).addWindow(this);
 *     }
 *       
 *     public void onDestroy() {
 *         super.onDestroy();
 *         ViewServer.get(this).removeWindow(this);
 *     }
 *   
 *     public void onResume() {
 *         super.onResume();
 *         ViewServer.get(this).setFocusedWindow(this);
 *     }
 * }
 * </pre>
 * 
 * <p>
 * In a similar fashion, you can use this API with an InputMethodService:
 * </p>
 * 
 * <pre>
 * public class MyInputMethodService extends InputMethodService {
 *     public void onCreate() {
 *         super.onCreate();
 *         View decorView = getWindow().getWindow().getDecorView();
 *         String name = "MyInputMethodService";
 *         ViewServer.get(this).addWindow(decorView, name);
 *     }
 *
 *     public void onDestroy() {
 *         super.onDestroy();
 *         View decorView = getWindow().getWindow().getDecorView();
 *         ViewServer.get(this).removeWindow(decorView);
 *     }
 *
 *     public void onStartInput(EditorInfo attribute, boolean restarting) {
 *         super.onStartInput(attribute, restarting);
 *         View decorView = getWindow().getWindow().getDecorView();
 *         ViewServer.get(this).setFocusedWindow(decorView);
 *     }
 * }
 * </pre>
 */
    public class ViewServer : Java.Lang.Object, IRunnable {
        /**
     * The default port used to start view servers.
     */
        private const int VIEW_SERVER_DEFAULT_PORT = 4939;
        private const int VIEW_SERVER_MAX_CONNECTIONS = 10;
        private const string BUILD_TYPE_USER = "user";

        // Debug facility
        private const string LOG_TAG = "ViewServer";

        private const string VALUE_PROTOCOL_VERSION = "4";
        private const string VALUE_SERVER_VERSION = "4";

        // Protocol commands
        // Returns the protocol version
        private const string COMMAND_PROTOCOL_VERSION = "PROTOCOL";
        // Returns the server version
        private const string COMMAND_SERVER_VERSION = "SERVER";
        // Lists all of the available windows in the system
        private const string COMMAND_WINDOW_MANAGER_LIST = "LIST";
        // Keeps a connection open and notifies when the list of windows changes
        private const string COMMAND_WINDOW_MANAGER_AUTOLIST = "AUTOLIST";
        // Returns the focused window
        private const string COMMAND_WINDOW_MANAGER_GET_FOCUS = "GET_FOCUS";

        private ServerSocket mServer;
        private readonly int mPort;

        private Thread mThread;
        private IExecutorService mThreadPool;

        private readonly CopyOnWriteArrayList mListeners =
            new CopyOnWriteArrayList();

        private readonly Dictionary<View, string> mWindows = new Dictionary<View, string>();
        private readonly ReentrantReadWriteLock mWindowsLock = new ReentrantReadWriteLock();

        private View mFocusedWindow;
        private readonly ReentrantReadWriteLock mFocusLock = new ReentrantReadWriteLock();

        private static ViewServer sServer;

        /**
     * Returns a unique instance of the ViewServer. This method should only be
     * called from the main thread of your application. The server will have
     * the same lifetime as your process.
     * 
     * If your application does not have the <code>android:debuggable</code>
     * flag set in its manifest, the server returned by this method will
     * be a dummy object that does not do anything. This allows you to use
     * the same code in debug and release versions of your application.
     * 
     * @param context A Context used to check whether the application is
     *                debuggable, this can be the application context
     */
        public static ViewServer Get(Context context) {
            ApplicationInfo info = context.ApplicationInfo;
            if (BUILD_TYPE_USER.Equals(Build.Type) &&
                (info.Flags & ApplicationInfoFlags.Debuggable) != 0) {
                if (sServer == null) {
                    sServer = new ViewServer(ViewServer.VIEW_SERVER_DEFAULT_PORT);
                }

                if (!sServer.IsRunning) {
                    try {
                        sServer.Start();
                    } catch (Java.IO.IOException e) {
                        Log.Debug(LOG_TAG, "Error:", e);
                    }
                }
            } else {
                sServer = new NoopViewServer();
            }

            return sServer;
        }

        private ViewServer() {
            mPort = -1;
        }

        /**
     * Creates a new ViewServer associated with the specified window manager on the
     * specified local port. The server is not started by default.
     *
     * @param port The port for the server to listen to.
     *
     * @see #start()
     */
        private ViewServer(int port) {
            mPort = port;
        }

        /**
     * Starts the server.
     *
     * @return True if the server was successfully created, or false if it already exists.
     * @throws IOException If the server cannot be created.
     *
     * @see #stop()
     * @see #isRunning()
     * @see WindowManagerService#startViewServer(int)
     */
        public virtual bool Start()
        {
            if (mThread != null) {
                return false;
            }

            mThread = new Thread(this, "Local View Server [port=" + mPort + "]");
            mThreadPool = Executors.NewFixedThreadPool(VIEW_SERVER_MAX_CONNECTIONS);
            mThread.Start();

            return true;
        }

        /**
     * Stops the server.
     *
     * @return True if the server was stopped, false if an error occurred or if the
     *         server wasn't started.
     *
     * @see #start()
     * @see #isRunning()
     * @see WindowManagerService#stopViewServer()
     */
        public virtual bool Stop() {
            if (mThread != null) {
                mThread.Interrupt();
                if (mThreadPool != null) {
                    try {
                        mThreadPool.ShutdownNow();
                    } catch (SecurityException) {
                        Log.Warn(LOG_TAG, "Could not stop all view server threads");
                    }
                }

                mThreadPool = null;
                mThread = null;

                try {
                    mServer.Close();
                    mServer = null;
                    return true;
                } catch (Java.IO.IOException) {
                    Log.Warn(LOG_TAG, "Could not close the view server");
                }
            }

            mWindowsLock.WriteLock().Lock();
            try {
                mWindows.Clear();
            } finally {
                mWindowsLock.WriteLock().Unlock();
            }

            mFocusLock.WriteLock().Lock();
            try {
                mFocusedWindow = null;
            } finally {
                mFocusLock.WriteLock().Unlock();
            }

            return false;
        }

        /**
     * Indicates whether the server is currently running.
     *
     * @return True if the server is running, false otherwise.
     *
     * @see #start()
     * @see #stop()
     * @see WindowManagerService#isViewServerRunning()  
     */
        public virtual bool IsRunning {
            get { return mThread != null && mThread.IsAlive; }
        }

        /**
     * Invoke this method to register a new view hierarchy.
     * 
     * @param activity The activity whose view hierarchy/window to register
     * 
     * @see #addWindow(View, String)
     * @see #removeWindow(Activity)
     */
        public virtual void AddWindow(Activity activity) {
            string name = activity.Title;
            if (TextUtils.IsEmpty(name)) {
                name = activity.Class.CanonicalName +
                    "/0x" + (activity).GetHashCode();
            } else {
                name += "(" + activity.Class.CanonicalName + ")";
            }
            AddWindow(activity.Window.DecorView, name);
        }

        /**
     * Invoke this method to unregister a view hierarchy.
     * 
     * @param activity The activity whose view hierarchy/window to unregister
     * 
     * @see #addWindow(Activity)
     * @see #removeWindow(View)
     */
        public virtual void RemoveWindow(Activity activity) {
            RemoveWindow(activity.Window.DecorView);
        }

        /**
     * Invoke this method to register a new view hierarchy.
     * 
     * @param view A view that belongs to the view hierarchy/window to register
     * @name name The name of the view hierarchy/window to register
     * 
     * @see #removeWindow(View)
     */
        public virtual void AddWindow(View view, string name) {
            mWindowsLock.WriteLock().Lock();
            try {
                mWindows.Add(view.RootView, name);
            } finally {
                mWindowsLock.WriteLock().Unlock();
            }
            FireWindowsChangedEvent();
        }

        /**
     * Invoke this method to unregister a view hierarchy.
     * 
     * @param view A view that belongs to the view hierarchy/window to unregister
     * 
     * @see #addWindow(View, String)
     */
        public virtual void RemoveWindow(View view) {
            mWindowsLock.WriteLock().Lock();
            try {
                mWindows.Remove(view.RootView);
            } finally {
                mWindowsLock.WriteLock().Unlock();
            }
            FireWindowsChangedEvent();
        }

        /**
     * Invoke this method to change the currently focused window.
     * 
     * @param activity The activity whose view hierarchy/window hasfocus,
     *                 or null to remove focus
     */
        public virtual void SetFocusedWindow(Activity activity) {
            SetFocusedWindow(activity.Window.DecorView);
        }

        /**
     * Invoke this method to change the currently focused window.
     * 
     * @param view A view that belongs to the view hierarchy/window that has focus,
     *             or null to remove focus
     */
        public virtual void SetFocusedWindow(View view) {
            mFocusLock.WriteLock().Lock();
            try {
                mFocusedWindow = view == null ? null : view.RootView;
            } finally {
                mFocusLock.WriteLock().Unlock();
            }
            FireFocusChangedEvent();
        }

        /**
     * Main server loop.
     */
        public virtual void Run() {
            try {
                mServer = new ServerSocket(mPort, VIEW_SERVER_MAX_CONNECTIONS, InetAddress.LocalHost);
            } catch (Java.Lang.Exception e) {
                Log.Warn(LOG_TAG, "Starting ServerSocket error: ", e);
            }

            while (mServer != null && Thread.CurrentThread() == mThread) {
                // Any uncaught exception will crash the system process
                try {
                    Java.Net.Socket client = mServer.Accept();
                    if (mThreadPool != null) {
                        mThreadPool.Submit(new ViewServerWorker(this, client));
                    } else {
                        try {
                            client.Close();
                        } catch (Java.IO.IOException e) {
                            e.PrintStackTrace();
                        }
                    }
                } catch (Java.Lang.Exception e) {
                    Log.Warn(LOG_TAG, "Connection error: ", e);
                }
            }
        }

        private static bool WriteValue(Java.Net.Socket client, string value) {
            bool result;
            BufferedWriter outWriter = null;
            try {
                Stream clientStream = client.OutputStream;
                outWriter = new BufferedWriter(new OutputStreamWriter(clientStream), 8 * 1024);
                outWriter.Write(value);
                outWriter.Write("\n");
                outWriter.Flush();
                result = true;
            } catch (Java.Lang.Exception) {
                result = false;
            } finally {
                if (outWriter != null) {
                    try {
                        outWriter.Close();
                    } catch (Java.IO.IOException) {
                        result = false;
                    }
                }
            }
            return result;
        }

        private void FireWindowsChangedEvent() {
            foreach (WindowListener listener in mListeners.ToEnumerable<WindowListener>()) {
                listener.WindowsChanged();
            }
        }

        private void FireFocusChangedEvent() {
            foreach (WindowListener listener in mListeners.ToEnumerable<WindowListener>()) {
                listener.FocusChanged();
            }
        }

        private void AddWindowListener(WindowListener listener) {
            if (!mListeners.Contains(listener)) {
                mListeners.Add(listener);
            }
        }

        private void RemoveWindowListener(WindowListener listener) {
            mListeners.Remove(listener);
        }

        private abstract class WindowListener : Java.Lang.Object {
            public abstract void WindowsChanged();
            public abstract void FocusChanged();
        }

        private class UncloseableOutputStream : OutputStream {
            private readonly Stream mStream;

            public UncloseableOutputStream(Stream stream) {
                mStream = stream;
            }

            public override void Close() {
                // Don't close the stream
            }

            public override bool Equals(object o) {
                return mStream.Equals(o);
            }

            public override void Flush() {
                mStream.Flush();
            }

            public override int GetHashCode() {
                return mStream.GetHashCode();
            }

            public override string ToString() {
                return mStream.ToString();
            }

            public override void Write(byte[] buffer, int offset, int count) {
                mStream.Write(buffer, offset, count);
            }

            public override void Write(byte[] buffer) {
                mStream.Write(buffer, 0, buffer.Length);
            }

            public override void Write(int oneByte) {
                mStream.WriteByte((byte)oneByte);
            }
        }

        private class NoopViewServer : ViewServer {
            internal NoopViewServer() {
            }

            public override bool Start() {
                return false;
            }

            public override bool Stop() {
                return false;
            }

            public override bool IsRunning {
                get { return false; }
            }

            public override void AddWindow(Activity activity) {
            }

            public override void RemoveWindow(Activity activity) {
            }

            public override void AddWindow(View view, string name) {
            }

            public override void RemoveWindow(View view) {
            }

            public override void SetFocusedWindow(Activity activity) {
            }

            public override void SetFocusedWindow(View view) {
            }

            public override void Run() {
            }
        }

        private class ViewServerWorker : WindowListener, IRunnable  {
            private Java.Net.Socket mClient;
            private bool mNeedWindowListUpdate;
            private bool mNeedFocusedWindowUpdate;

            private readonly Java.Lang.Object mLock = new Java.Lang.Object[0];

            private ViewServer mViewServer;

            public ViewServerWorker(ViewServer viewServer, Java.Net.Socket client) {
                mClient = client;
                mNeedWindowListUpdate = false;
                mNeedFocusedWindowUpdate = false;
                mViewServer = viewServer;
            }

            public void Run() {
                BufferedReader inReader = null;
                try {
                    inReader = new BufferedReader(new InputStreamReader(mClient.InputStream), 1024);

                    string request = inReader.ReadLine();

                    string command;
                    string parameters;

                    int index = request.IndexOf(' ');
                    if (index == -1) {
                        command = request;
                        parameters = "";
                    } else {
                        command = request.Substring(0, index);
                        parameters = request.Substring(index + 1);
                    }

                    bool result;
                    if (COMMAND_PROTOCOL_VERSION.Equals(command, StringComparison.CurrentCultureIgnoreCase)) {
                        result = WriteValue(mClient, VALUE_PROTOCOL_VERSION);
                    } else if (COMMAND_SERVER_VERSION.Equals(command, StringComparison.CurrentCultureIgnoreCase)) {
                        result = WriteValue(mClient, VALUE_SERVER_VERSION);
                    } else if (COMMAND_WINDOW_MANAGER_LIST.Equals(command, StringComparison.CurrentCultureIgnoreCase)) {
                        result = ListWindows(mClient);
                    } else if (COMMAND_WINDOW_MANAGER_GET_FOCUS.Equals(command, StringComparison.CurrentCultureIgnoreCase)) {
                        result = GetFocusedWindow(mClient);
                    } else if (COMMAND_WINDOW_MANAGER_AUTOLIST.Equals(command, StringComparison.CurrentCultureIgnoreCase)) {
                        result = WindowManagerAutolistLoop();
                    } else {
                        result = WindowCommand(mClient, command, parameters);
                    }

                    if (!result) {
                        Log.Warn(LOG_TAG, "An error occurred with the command: " + command);
                    }
                } catch(Java.IO.IOException e) {
                    Log.Warn(LOG_TAG, "Connection error: ", e);
                } finally {
                    if (inReader != null) {
                        try {
                            inReader.Close();

                        } catch (Java.IO.IOException e) {
                            e.PrintStackTrace();
                        }
                    }
                    if (mClient != null) {
                        try {
                            mClient.Close();
                        } catch (Java.IO.IOException e) {
                            e.PrintStackTrace();
                        }
                    }
                }
            }

            private bool WindowCommand(Java.Net.Socket client, string command, string parameters) {
                bool success = true;
                BufferedWriter outReader = null;

                try {
                    // Find the hash code of the window
                    int index = parameters.IndexOf(' ');
                    if (index == -1) {
                        index = parameters.Length;
                    }
                    string code = parameters.Substring(0, index);
                    int hashCode = (int) Long.ParseLong(code, 16);

                    // Extract the command's parameter after the window description
                    if (index < parameters.Length) {
                        parameters = parameters.Substring(index + 1);
                    } else {
                        parameters = "";
                    }

                    View window = FindWindow(hashCode);
                    if (window == null) {
                        return false;
                    }

                    var cmdPtr = JNIEnv.NewString(command);
                    var parameterPtr = JNIEnv.NewString(parameters);

                    var classPtr = JNIEnv.FindClass(typeof(ViewDebug));
                    var methodPtr = JNIEnv.GetStaticMethodID(classPtr, "dispatchCommand","(Landroid/view/View;Ljava/lang/String;Ljava/lang/String;Ljava/io/OutputStream;)V");
                    JNIEnv.CallStaticVoidMethod(classPtr, methodPtr, new JValue(window), new JValue(cmdPtr), new JValue(parameterPtr), new JValue(new UncloseableOutputStream(client.OutputStream)));

                    if (!client.IsOutputShutdown) {
                        outReader = new BufferedWriter(new OutputStreamWriter(client.OutputStream));
                        outReader.Write("DONE\n");
                        outReader.Flush();
                    }

                } catch (Java.Lang.Exception e) {
                    Log.Warn(LOG_TAG, "Could not send command " + command +
                          " with parameters " + parameters, e);
                    success = false;
                } finally {
                    if (outReader != null) {
                        try {
                            outReader.Close();
                        } catch (Java.IO.IOException) {
                            success = false;
                        }
                    }
                }

                return success;
            }

            private View FindWindow(int hashCode) {
                if (hashCode == -1) {
                    View window = null;
                    mViewServer.mWindowsLock.ReadLock().Lock();
                    try {
                        window = mViewServer.mFocusedWindow;
                    } finally {
                        mViewServer.mWindowsLock.ReadLock().Unlock();
                    }
                    return window;
                }


                mViewServer.mWindowsLock.ReadLock().Lock();
                try {
                    foreach (var entry in mViewServer.mWindows) {
                        if (entry.Key.GetHashCode() == hashCode) {
                            return entry.Key;
                        }
                    }
                } finally {
                    mViewServer.mWindowsLock.ReadLock().Unlock();
                }

                return null;
            }

            private bool ListWindows(Java.Net.Socket client) {
                bool result = true;
                BufferedWriter outReader = null;

                try {
                    mViewServer.mWindowsLock.ReadLock().Lock();

                    Stream clientStream = client.OutputStream;
                    outReader = new BufferedWriter(new OutputStreamWriter(clientStream), 8 * 1024);

                    foreach (var entry in mViewServer.mWindows) {
                        outReader.Write(Integer.ToHexString(entry.Key.GetHashCode()));
                        outReader.Write(' ');
                        outReader.Append(entry.Value);
                        outReader.Write('\n');
                    }

                    outReader.Write("DONE.\n");
                    outReader.Flush();
                } catch (Java.Lang.Exception) {
                    result = false;
                } finally {
                    mViewServer.mWindowsLock.ReadLock().Unlock();

                    if (outReader != null) {
                        try {
                            outReader.Close();
                        } catch (Java.IO.IOException) {
                            result = false;
                        }
                    }
                }

                return result;
            }

            private bool GetFocusedWindow(Java.Net.Socket client) {
                bool result = true;
                string focusName = null;

                BufferedWriter outReader = null;
                try {
                    Stream clientStream = client.OutputStream;
                    outReader = new BufferedWriter(new OutputStreamWriter(clientStream), 8 * 1024);

                    View focusedWindow = null;

                    mViewServer.mFocusLock.ReadLock().Lock();
                    try {
                        focusedWindow = mViewServer.mFocusedWindow;
                    } finally {
                        mViewServer.mFocusLock.ReadLock().Unlock();
                    }

                    if (focusedWindow != null) {
                        mViewServer.mWindowsLock.ReadLock().Lock();
                        try {
                            focusName = mViewServer.mWindows[mViewServer.mFocusedWindow];
                        } finally {
                            mViewServer.mWindowsLock.ReadLock().Unlock();
                        }

                        outReader.Write(Integer.ToHexString(focusedWindow.GetHashCode()));
                        outReader.Write(' ');
                        outReader.Append(focusName);
                    }
                    outReader.Write('\n');
                    outReader.Flush();
                } catch (Java.Lang.Exception) {
                    result = false;
                } finally {
                    if (outReader != null) {
                        try {
                            outReader.Close();
                        } catch (Java.IO.IOException) {
                            result = false;
                        }
                    }
                }

                return result;
            }

            public override void WindowsChanged() {
                lock (mLock) {
                    mNeedWindowListUpdate = true;
                    mLock.NotifyAll();
                }
            }

            public override void FocusChanged() {
                lock (mLock) {
                    mNeedFocusedWindowUpdate = true;
                    mLock.NotifyAll();
                }
            }

            private bool WindowManagerAutolistLoop() {
                mViewServer.AddWindowListener(this);
                BufferedWriter outReader = null;
                try {
                    outReader = new BufferedWriter(new OutputStreamWriter(mClient.OutputStream));
                    while (!Thread.Interrupted()) {
                        bool needWindowListUpdate = false;
                        bool needFocusedWindowUpdate = false;
                        lock (mLock) {
                            while (!mNeedWindowListUpdate && !mNeedFocusedWindowUpdate) {
                                mLock.Wait();
                            }
                            if (mNeedWindowListUpdate) {
                                mNeedWindowListUpdate = false;
                                needWindowListUpdate = true;
                            }
                            if (mNeedFocusedWindowUpdate) {
                                mNeedFocusedWindowUpdate = false;
                                needFocusedWindowUpdate = true;
                            }
                        }
                        if (needWindowListUpdate) {
                            outReader.Write("LIST UPDATE\n");
                            outReader.Flush();
                        }
                        if (needFocusedWindowUpdate) {
                            outReader.Write("FOCUS UPDATE\n");
                            outReader.Flush();
                        }
                    }
                } catch (Java.Lang.Exception e) {
                    Log.Warn(LOG_TAG, "Connection error: ", e);
                } finally {
                    if (outReader != null) {
                        try {
                            outReader.Close();
                        } catch (Java.IO.IOException) {
                            // Ignore
                        }
                    }
                    mViewServer.RemoveWindowListener(this);
                }
                return true;
            }
        }
    }
}