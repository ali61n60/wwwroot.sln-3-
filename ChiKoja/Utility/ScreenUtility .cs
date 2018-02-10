using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Views;
using Android.Widget;

namespace ChiKoja.Utility
{
    public class ScreenUtility
    {
        private readonly float dpWidth;
        private readonly float dpHeight;
        private readonly float density;

        public ScreenUtility(Activity activity)
        {
            Display display = activity.WindowManager.DefaultDisplay;
            DisplayMetrics outMetrics = new DisplayMetrics();
            display.GetMetrics(outMetrics);

            density = activity.Resources.DisplayMetrics.Density;
            dpHeight = outMetrics.HeightPixels / density;
            dpWidth = outMetrics.WidthPixels / density;
        }

        public float GetWidth()
        {
            return dpWidth;
        }

        public float GetHeight()
        {
            return dpHeight;
        }

        public float GetDensity()
        {
            return density;
        }
    }
}