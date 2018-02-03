using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Views.Animations;
using Android.Widget;
using Java.Lang;

namespace ChiKoja.AnimationTest
{
    [Activity(Label = "ActivityAnimation")]
    public class ActivityAnimation : Activity
    {
        Button buttonAnimate;
        Button button2;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            SetContentView(Resource.Layout.Animation);
            buttonAnimate = FindViewById<Button>(Resource.Id.buttonAnimate);
            buttonAnimate.Click += buttonAnimate_Click;
            button2 = FindViewById<Button>(Resource.Id.button2);
        }

        void buttonAnimate_Click(object sender, EventArgs e)
        {
            
            button2.Animate()
                .SetDuration(5000)
                .Rotation(180).WithEndAction(new Runnable(() =>
                {
                    button2.Animate().SetDuration(5000).Rotation(0);
                }));
        }
    }
}