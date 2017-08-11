using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using ChiKoja.CustomViews.SingleAdView;
using ChiKoja.Login;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository;
using ChiKoja.Services;
using ChiKoja.Services.Server;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.SearchAd.UserAd
{
    [Activity(Label = "ActivityUserAds", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class ActivityUserAds : NavActivity, ISearchAdResult<AdvertisementCommon[]>
    {
        //TODO get user ads from server and show them on page
        //TODO ad first image to single user ad
        protected const int LoginRequestCode = 1;
        Registration registration;
        View rootView;
        LinearLayout userAdsPlaceHolder;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            initializeFields();
            manageUserAds();
        }

        private void inflateView()
        {
            FrameLayout contentFrameLayout = FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            rootView = LayoutInflater.Inflate(Resource.Layout.UserAds, contentFrameLayout);
        }
        private void initializeFields()
        {
            userAdsPlaceHolder = rootView.FindViewById<LinearLayout>(Resource.Id.layoutUserAdsLinearLayout);
            registration = new Registration();
        }
        private void manageUserAds()
        {
            userAdsPlaceHolder.RemoveAllViews();
            if (!registration.IsUserLoggedIn)
                tellUserToLogIn();
            else
                getUserAdsFromServerAndShowOnPage();
        }

        private void tellUserToLogIn()
        {
            showUserNotLoggedInMessage();
            addViewToTransferUserToLoginActivity();
        }

        private void getUserAdsFromServerAndShowOnPage()
        {
            AdApi adApi = new AdApi();
            adApi.GetUserAdsFromeServer(this, registration.UserName, registration.Password);
        }


        private void showUserNotLoggedInMessage()
        {
            TextView textViewUserNotLoggedIn = new TextView(this)
            {
                Text =Resources.GetString(Resource.String.PleaseLogIn) 
            };
            userAdsPlaceHolder.AddView(textViewUserNotLoggedIn);
        }
        private void addViewToTransferUserToLoginActivity()
        {
            Button buttonTransferToLoginActivity = new Button(this)
            {
                Text = Resources.GetString(Resource.String.GoToLoginPage) 
            };
            buttonTransferToLoginActivity.Click += ((s, e) =>
            {
                Intent intentLogin = new Intent(this, typeof(ActivityLogin));
                StartActivityForResult(intentLogin, LoginRequestCode);
            });
            userAdsPlaceHolder.AddView(buttonTransferToLoginActivity);
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);
            if (requestCode == LoginRequestCode)
            {
                if (resultCode == Result.Ok)
                {
                    manageUserAds();
                }
            }
        }
        
        private void addAdvertisementOnPage(AdvertisementCommon advertisementCommon, LinearLayout.LayoutParams layoutParams)
        {
            ViewGroupUserAd viewGroupUserAd = cretateNewViewUserAd(advertisementCommon);
            userAdsPlaceHolder.AddView(viewGroupUserAd, layoutParams);
        }
        private ViewGroupUserAd cretateNewViewUserAd(AdvertisementCommon advertisementCommon)
        {
            ViewGroupUserAd viewGroupUserAd=new ViewGroupUserAd(this);
            viewGroupUserAd.AdTitle = advertisementCommon.AdvertisementTitle + ", " + advertisementCommon.CityName;
            viewGroupUserAd.AdPrice = advertisementCommon.AdvertisementPrice.price.ToString();
            if(advertisementCommon.AdvertisementImages!=null)
                viewGroupUserAd.AdImage = advertisementCommon.AdvertisementImages[0];
            viewGroupUserAd.AdCategoryId = advertisementCommon.AdvertisementCategoryId;
            viewGroupUserAd.AdGuid = advertisementCommon.AdvertisementId;
            return viewGroupUserAd;
        }

        public void OnSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response)
        {
            
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            LinearLayout.LayoutParams layoutParams =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
            layoutParams.SetMargins(0, 20, 0, 20);

            if (response.Success)
                foreach (AdvertisementCommon advertisementCommon in response.ResponseData)
                    addAdvertisementOnPage(advertisementCommon, layoutParams);
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