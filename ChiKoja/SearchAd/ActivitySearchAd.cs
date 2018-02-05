using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.Categories;
using ChiKoja.NavigationDrawer;
using ChiKoja.CustomViews.SingleAdView;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Models;
using ChiKoja.Notification;
using ChiKoja.Services.Server;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace ChiKoja.SearchAd
{
    [Activity(Label = "ActivitySearchAd", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class ActivitySearchAd : NavActivity
    {
        private SearchFragment searchFragment;
        private readonly string AdTypeKey = "AdType";
        private readonly string SearchTextKey = "SearchText";
        
        public const int CategorySelectionRequestCode = 2;
       
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            chechIntentMessage(); //exit command ...
            inflateView();
            addFragments();
        }

        private void chechIntentMessage()
        {
            if (Intent.GetBooleanExtra("EXIT", false))
                Finish();
        }

        private void inflateView()
        {
            FrameLayout contentFrameLayout =
                FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            LayoutInflater.Inflate(Resource.Layout.search_ad, contentFrameLayout);
        }

        private void addFragments()
        {
            searchFragment = new SearchFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.myContainer, searchFragment)
                .Commit();
        }

        

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (requestCode == LocationSelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("locationSelectionChanged", false))
                    searchFragment.resetSearchCondition();
            }
            if (requestCode == CategorySelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("categorySelectionChanged", false))
                    searchFragment.resetSearchCondition();
            }
            if (requestCode == SearchFilterRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("SearchFilterChanged", false))
                    searchFragment.resetSearchCondition();
            }
            if (requestCode == OrderByRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("OrderByChanged", false))
                    searchFragment.resetSearchCondition();
            }
        }
        

        public void OnSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            LinearLayout.LayoutParams layoutParams =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
            layoutParams.SetMargins(0, 20, 0, 20);

            if (response.Success)
                foreach (AdvertisementCommon advertisementCommon in response.ResponseData)
                    searchFragment.addAdvertisementOnPage(advertisementCommon, layoutParams);
            else
                Toast.MakeText(ApplicationContext, response.Message, ToastLength.Long).Show();
        }
       
        public void OnSearchAdError(Exception ex)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            Toast.MakeText(ApplicationContext, ex.Message, ToastLength.Short).Show();
        }
    }
}