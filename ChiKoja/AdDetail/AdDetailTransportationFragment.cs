using System;
using System.Threading.Tasks;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Support.V4.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Notification;
using ChiKoja.Repository.UserMarkedAds;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Services;


namespace ChiKoja.AdDetail
{
    public class AdDetailTransportationFragment : CategorySpecificBaseFragment
    {
        

        View rootView;
        AdvertisementTransportation advertisementTransportation;
        private TextView textViewAdTitle;
        private TextView textViewBrand;

        
        Guid adGuid;
        private readonly int categoryId = 100;

        public AdDetailTransportationFragment() { }

        public override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
        }
        
        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_transportation_fragment, container, false);
            return rootView;
        }

        public override void SetAdDetailData(AdvertisementCommon adDetail)
        {
            if (adDetail is AdvertisementTransportation)
            {
                advertisementTransportation=adDetail as AdvertisementTransportation;
                initializeFields();
                initializeEvents();
            }
            else
            {
                throw new Exception("input parameter must be of type AdvertisementTransportation");
            }
        }
        
        private void initializeFields()
        {
            textViewAdTitle = rootView.FindViewById<TextView>(Resource.Id.textViewAdTitle);
            textViewAdTitle.Text = advertisementTransportation.AdvertisementTitle;

            textViewBrand = rootView.FindViewById<TextView>(Resource.Id.textViewBrand);
            textViewBrand.Text = advertisementTransportation.BrandName;
        }

        private void initializeEvents()
        {

        }

        

        
    }
}