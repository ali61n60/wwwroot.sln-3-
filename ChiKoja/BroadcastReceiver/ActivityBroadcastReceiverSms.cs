using Android.App;
using Android.Content;
using Android.Net.Wifi;
using Android.OS;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Android.Widget;


namespace ChiKoja.BroadcastReceiver
{
    [Activity(Label = "ActivityBroadcastReceiverSms", Icon = "@drawable/icon")]
    public class ActivityBroadcastReceiverSms : AppCompatActivity
    {
        int count;
        AirPlaneMode airplaneMode;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            
            SetContentView(Resource.Layout.layout_broadcast_receiver_sms);
            
            AppCompatButton button = FindViewById<AppCompatButton>(Resource.Id.buttonBroad);

            button.Click += delegate
            {
                string text = string.Format("{0} clicks!", count++);
                button.Text = text;

                SlidingDrawer slidingDrawer= FindViewById<SlidingDrawer>(Resource.Id.slidingDrawer1);
                LinearLayout contentLayout = slidingDrawer.FindViewById<LinearLayout>(Resource.Id.content);
                ScrollView scrollView = contentLayout.FindViewById<ScrollView>(Resource.Id.scrollView1);

                AppCompatButton newButton = new AppCompatButton(this);
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