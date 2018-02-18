using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Views;
using Android.Widget;

namespace ChiKoja.AdDetail
{
    public class AdDetailWarning:Fragment
    {
        private View rootView;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_warning_frag, container, false);
            return rootView;
        }

        public override async void OnResume()
        {
            base.OnResume();

            initializeFields();
            initializeEvents();
        }

        private void initializeFields()
        {

        }

        private void initializeEvents()
        {

        }
    }
}