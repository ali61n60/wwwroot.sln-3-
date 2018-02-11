using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ChiKoja.Notification;
using Uri = Android.Net.Uri;

namespace ChiKoja.BroadcastReceiver
{

    [Activity(Label = "ActivityBatteryBroadCast", Icon = "@drawable/icon")]
    public class ActivityBatteryBroadCast : Activity
    {
        BatteryReceiver batteryReceiver;
        Button callButton;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.layout_battery_broadcast);
            callButton = FindViewById<Button>(Resource.Id.buttonCall);
            callButton.Click += callButton_Click;
            // Create your application here
        }

        void callButton_Click(object sender, EventArgs e)
        {
           string posted_by = "02144400107";

            String uri = "tel:"+ posted_by.Trim();
            
            Android.Content.Intent intent = new Intent(Intent.ActionDial);
            

            intent.SetData(Uri.Parse(uri));

            
           if( intent.ResolveActivity(PackageManager)!=null)
            StartActivity(intent);
        }

        //protected override void OnResume()
        //{
        //    base.OnResume();
        //    batteryReceiver=new BatteryReceiver();
        //    RegisterReceiver(batteryReceiver, new IntentFilter(Intent.ActionBatteryChanged));
        //}

        //protected override void OnPause()
        //{
        //    base.OnPause();
        //   // UnregisterReceiver(batteryReceiver);
        //}
    }

    public class BatteryReceiver:Android.Content.BroadcastReceiver
    {
        public override void OnReceive(Context context, Intent intent)
        {
            int batteryLevel= intent.GetIntExtra(BatteryManager.ExtraLevel,-1);
           
            int batteryScale = intent.GetIntExtra(BatteryManager.ExtraScale,-1);
            float batteryPercent = (batteryLevel*100)/(float) batteryScale;
            Toast.MakeText(context,"Battery BroadCast, Battery Level is"+batteryPercent+"%",ToastLength.Long).Show();
        }
    }
}