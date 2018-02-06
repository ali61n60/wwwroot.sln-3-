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
    class SingleAdArrayAdaptor:ArrayAdapter<AdvertisementCommon>
    {
        public SingleAdArrayAdaptor(Context context, int textViewResourceId) : base(context, textViewResourceId)
        {
        }

        public SingleAdArrayAdaptor(Context context, int textViewResourceId, IList<AdvertisementCommon> objects) : base(context, textViewResourceId, objects)
        {
        }

        public SingleAdArrayAdaptor(Context context, int resource, int textViewResourceId, IList<AdvertisementCommon> objects) : base(context, resource, textViewResourceId, objects)
        {
        }
    }
}