using System;
using System.Drawing;
#if __UNIFIED__
using UIKit;
using Foundation;
using CoreGraphics;
#else
using MonoTouch.UIKit;
using MonoTouch.Foundation;
using CGRect = global::System.Drawing.RectangleF;
using nfloat = global::System.Single;
#endif
using RangeSlider;

namespace RangeSliderSample {
	public partial class RangeSliderViewController : UIViewController {

		static bool UserInterfaceIdiomIsPhone {
			get { return UIDevice.CurrentDevice.UserInterfaceIdiom == UIUserInterfaceIdiom.Phone; }
		}

		public RangeSliderViewController ()
			: base (UserInterfaceIdiomIsPhone ? "RangeSliderViewController_iPhone" : "RangeSliderViewController_iPad", null)
		{
		}


		public override void ViewDidLoad ()
		{
			base.ViewDidLoad ();

			var rangeSlider = new RangeSliderView {
				Frame = new CGRect (50f, View.Center.Y - 140f, View.Frame.Width - 100f, 40f),
				AutoresizingMask = UIViewAutoresizing.FlexibleBottomMargin | UIViewAutoresizing.FlexibleTopMargin | UIViewAutoresizing.FlexibleWidth
			};

			rangeSlider.LeftValueChanged += HandleLeftValueChanged;
			rangeSlider.RightValueChanged += HandleRightValueChanged;

//			rangeSlider.MinValue = 0f; // Set minimum value (default: 0f)
//			rangeSlider.MaxValue = 100f; // Set maximum value (default: 1f)
//			rangeSlider.Step = 10f; // Set step (default: 0f)
//
//			rangeSlider.LeftValue = 30f;
//			rangeSlider.RightValue = 70f;

			View.AddSubview (rangeSlider);


			var slider = new UISlider {
				Frame = new CGRect (50f, View.Center.Y + 100f, View.Frame.Width - 100f, 20f),
				AutoresizingMask = UIViewAutoresizing.FlexibleBottomMargin | UIViewAutoresizing.FlexibleTopMargin | UIViewAutoresizing.FlexibleWidth
			};

			View.AddSubview (slider);
		}

		
		void HandleRightValueChanged (nfloat value)
		{
			Console.WriteLine ("Right value changed: " + value);
		}
		
		void HandleLeftValueChanged (nfloat value)
		{
			Console.WriteLine ("Left value changed: " + value);
		}

		public override void ViewDidUnload ()
		{
			base.ViewDidUnload ();
			
			ReleaseDesignerOutlets ();
		}
		
		public override void DidReceiveMemoryWarning ()
		{
			base.DidReceiveMemoryWarning ();
		}
		
		public override bool ShouldAutorotateToInterfaceOrientation (UIInterfaceOrientation toInterfaceOrientation)
		{
			if (UserInterfaceIdiomIsPhone) {
				return (toInterfaceOrientation != UIInterfaceOrientation.PortraitUpsideDown);
			} else {
				return true;
			}
		}
	}
}

