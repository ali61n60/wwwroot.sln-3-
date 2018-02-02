using Android.Content;
using Android.Widget;
using Android.Net;

namespace ChiKoja.Network
{
    public class Network
    {
        //TODO add code for network connectivity and notifying user if not connected
        public bool IsOnline(Context context)
        {
            ConnectivityManager cm = (ConnectivityManager)context.GetSystemService(Context.ConnectivityService);
            return cm.ActiveNetworkInfo != null && cm.ActiveNetworkInfo.IsConnectedOrConnecting;
        }

        public bool NetWorkType(Context context)
        {
            ConnectivityManager cm = (ConnectivityManager)context.GetSystemService(Context.ConnectivityService);
            NetworkInfo activeNetworkInfo = cm.ActiveNetworkInfo;

            if (activeNetworkInfo != null)
            { // connected to the internet
                Toast.MakeText(context, activeNetworkInfo.TypeName, ToastLength.Short).Show();

                if (activeNetworkInfo.Type == ConnectivityType.Wifi)
                {
                    // connected to wifi
                    return true;
                }
                else if (activeNetworkInfo.Type == ConnectivityType.Mobile)
                {
                    // connected to the mobile provider's data plan
                    return true;
                }
            }
            return false;
        }
    }

    public class NetWorkStatusReceiver : Android.Content.BroadcastReceiver
    {
        public override void OnReceive(Context context, Intent intent)
        {
            Toast.MakeText(context,"conectivity changed",ToastLength.Long).Show();
        }
    }
}