using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Timers;
using Android.App;
using Android.Content;

using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ChiKoja.GlobalApplication;
using ChiKoja.NavigationDrawer;

namespace ChiKoja.Notification
{
    public class MessageShower
    {
        private static MessageShower _singleton;
        private Timer _showMessageTimer;
        int _numberOfShowMessageCall = 0;
        Context _context;
        string currentMessage = "";
        private NavActivity _currentNavActivity;
        public NavActivity CurrentNavActivity
        {
            get { return _currentNavActivity; }
            set
            {
                _currentNavActivity = value;
                showMessage(currentMessage);
            }
        }

        private MessageShower(Context context)
        {
            _context = context;
        }
        public static MessageShower GetMessageShower(Context context)
        {
            return _singleton ?? (_singleton = new MessageShower(context));
        }

        public void ShowMessage(string message, ShowMessageType showMessageType)
        {

            if (CurrentNavActivity == null)
                return;

            switch (showMessageType)
            {
                case ShowMessageType.Short:
                    _showMessageTimer = new Timer(_context.Resources.GetInteger(Resource.Integer.MessageTimeShort));
                    _showMessageTimer.Elapsed += showMessageTimer_Elapsed;
                    _showMessageTimer.AutoReset = false;
                    _numberOfShowMessageCall++;
                    _showMessageTimer.Start();
                    break;
                case ShowMessageType.Long:
                    _showMessageTimer = new Timer(_context.Resources.GetInteger(Resource.Integer.MessageTimeLong));
                    _showMessageTimer.Elapsed += showMessageTimer_Elapsed;
                    _showMessageTimer.AutoReset = false;
                    _numberOfShowMessageCall++;
                    _showMessageTimer.Start();
                    break;
            }
            showMessage(message);
        }

        private void showMessage(string message)
        {
            currentMessage = message;
            CurrentNavActivity.ShowMessage(message);
        }

        void showMessageTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            _numberOfShowMessageCall--;
            if (_numberOfShowMessageCall == 0)
                ShowDefaultMessage();
        }

        public void ShowDefaultMessage()
        {
            showMessage(_context.Resources.GetString(Resource.String.DefaultToolbarMessage));
        }
    }
    public enum ShowMessageType
    {
        Short,
        Long,
        Permanent
    }
}