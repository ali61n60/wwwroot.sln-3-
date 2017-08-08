using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Android.Debug.HV;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace ChiKoja.ViewServer
{
    [Activity(Label = "ActivityViewServerTest")]
    public class ActivityViewServerTest : Activity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            Android.Debug.HV.ViewServer.Get(this).AddWindow(this);
        }

        protected override void OnResume()
        {
            base.OnResume();
            Android.Debug.HV.ViewServer.Get(this).SetFocusedWindow(this);
        }

        protected override void OnDestroy()
        {
            base.OnDestroy();
            Android.Debug.HV.ViewServer.Get(this).RemoveWindow(this);
        }
    }
}