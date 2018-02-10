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
using ModelStd.Advertisements;

namespace ChiKoja.AdDetail
{
    public class AdDetailCommonPartFragment:Fragment
    {
        private View rootView;
        private TextView textViewAdTitle;
        AdvertisementCommon _advertisementCommon;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_common_part, container, false);
            return rootView;
        }

       
        public void SetAdvertisementCommon(AdvertisementCommon advertisementCommon)
        {
            _advertisementCommon = advertisementCommon;
            initializeFields();
            initializeEvents();
            //TODO pass data to views
        }

        private void initializeFields()
        {
            textViewAdTitle = rootView.FindViewById<TextView>(Resource.Id.textViewAdTitle);
            textViewAdTitle.Text = _advertisementCommon.AdvertisementTitle;
        }

        private void initializeEvents()
        {

        }
    }
}