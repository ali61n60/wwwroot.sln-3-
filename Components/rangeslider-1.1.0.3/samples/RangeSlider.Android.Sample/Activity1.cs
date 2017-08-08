using System;

using Android.App;
using Android.Widget;
using Android.OS;
using RangeSlider;

namespace RangeSlider.Android.Sample {
	[Activity (Label = "RangeSlider.Android", MainLauncher = true)]
	public class Activity1 : Activity {

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);
			SetContentView (Resource.Layout.Main);

			var rangeSlider = FindViewById<RangeSliderView> (Resource.Id.rangeSlider1);

			// Also you can add range slider manually, if you want
			// var rangeSlider = new Xamarin.Controls.RangeSlider (this, 0, 100, 10);
			// rangeSlider.LeftValue = 20;
			// rangeSlider.RightValue = 80;
			// rangeSlider.LayoutParameters = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.FillParent, LinearLayout.LayoutParams.WrapContent);
			// FFindViewById<LinearLayout>(Resource.Id.rootLayout).AddView(rangeSlider);

			rangeSlider.LeftValueChanged += HandleLeftValueChanged;
			rangeSlider.RightValueChanged += HandleRightValueChanged;

			var button = FindViewById<Button> (Resource.Id.myButton);
			button.Click += (s, e) => rangeSlider.Step = 0;
		}

		void HandleRightValueChanged (float value)
		{
			Console.WriteLine ("Right value changed: " + value);
		}

		void HandleLeftValueChanged (float value)
		{
			Console.WriteLine ("Left value changed: " + value);
		}
	}
}


