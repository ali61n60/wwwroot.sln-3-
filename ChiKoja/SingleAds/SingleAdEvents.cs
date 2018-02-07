using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ModelStd.Advertisements;

namespace ChiKoja.SingleAds
{
    public interface SingleAdEvents
    {
        void OnSingleAdSelected(AdvertisementCommon adCommon);
    }
}