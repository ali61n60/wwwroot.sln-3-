using System;
using Android.App;
using Android.OS;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Java.Lang;

namespace ChiKoja.AnimationTest
{
    [Activity(Label = "ActivityAnimation")]
    public class ActivityAnimation : AppCompatActivity
    {
        AppCompatButton buttonAnimate;
        AppCompatButton button2;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            SetContentView(Resource.Layout.animation);
            buttonAnimate = FindViewById<AppCompatButton>(Resource.Id.buttonAnimate);
            buttonAnimate.Click += buttonAnimate_Click;
            button2 = FindViewById<AppCompatButton>(Resource.Id.button2);
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