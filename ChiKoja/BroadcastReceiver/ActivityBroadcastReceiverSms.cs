using System.Text;

using Android.App;
using Android.Content;
using Android.Media;
using Android.Net.Wifi;
using Android.OS;
using Android.Telephony;
using Android.Util;
using Android.Views;
using Android.Widget;
using Java.Lang;


namespace ChiKoja.BroadcastReceiver
{
    [Activity(Label = "ActivityBroadcastReceiverSms", Icon = "@drawable/icon")]
    public class ActivityBroadcastReceiverSms : Activity
    {
        int count;
        AirPlaneMode airplaneMode;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            ActionBar.Hide();

            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.layoutBroadcastReceiverSms);

            // Get our button from the layout resource,
            // and attach an event to it
            Button button = FindViewById<Button>(Resource.Id.buttonBroad);

            button.Click += delegate
            {
                string text = string.Format("{0} clicks!", count++);
                button.Text = text;

                SlidingDrawer slidingDrawer= FindViewById<SlidingDrawer>(Resource.Id.slidingDrawer1);
                LinearLayout contentLayout = slidingDrawer.FindViewById<LinearLayout>(Resource.Id.content);
                ScrollView scrollView = contentLayout.FindViewById<ScrollView>(Resource.Id.scrollView1);

                Button newButton = new Button(this);
                newButton.Text = text;
                newButton.Id = count;
                contentLayout.AddView(newButton);


            };

        }

        protected override void OnResume()
        {
            base.OnResume();
            airplaneMode = new AirPlaneMode();

            IntentFilter filter = new IntentFilter(Intent.ActionAirplaneModeChanged);
            RegisterReceiver(airplaneMode, filter);

            RegisterReceiver(airplaneMode, new IntentFilter(Intent.ActionBatteryChanged));
        }

        protected override void OnPause()
        {
            base.OnPause();

            UnregisterReceiver(airplaneMode);
        }
    }

    [BroadcastReceiver(Enabled = true)]
    [IntentFilter(new[] { Intent.ActionHeadsetPlug,
        WifiManager.WifiStateChangedAction,
        "android.media.VOLUME_CHANGED_ACTION",
        
    })]
    public class AirPlaneMode : Android.Content.BroadcastReceiver
    {
        public override void OnReceive(Context context, Intent intent)
        {
            string Message = intent.Action;
            Toast.MakeText(context, Message, ToastLength.Short).Show();
        }
    }
}