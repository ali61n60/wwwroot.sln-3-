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
        private readonly string AdTypeKey = "AdType";
        private readonly string SearchTextKey = "SearchText";
        
        protected const int CategorySelectionRequestCode = 2;
        IAdApi _adApi;

        View rootView;
        Button buttonFilter;

        Button buttonSort;

        //Button buttonSearchAd;
        AppCompatButton buttonSearchAd;

        Button buttonCategory;
        LinearLayout searchResultPlaceHolder;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            chechIntentMessage(); //exit command ...
            inflateView();
            initializeFields();
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
            rootView = LayoutInflater.Inflate(Resource.Layout.search_ad, contentFrameLayout);
        }

        private void initializeFields()
        {
            _adApi = Bootstrapper.container.GetInstance<IAdApi>();

            buttonSearchAd = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSearch);
            buttonSearchAd.Click +=async (sender, args) =>
            {
                GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
                ResponseBase<AdvertisementCommon[]> response = await _adApi.GetAdvertisementCommon();
                if(response.Success)
                    OnSerachAdCompleted(response);
                else
                    OnSearchAdError(new Exception(response.Message+", ErrorCode:"+response.ErrorCode));
            };

            buttonFilter = rootView.FindViewById<Button>(Resource.Id.buttonFilter);
            buttonFilter.Click += buttonFilter_Click;

            buttonSort = rootView.FindViewById<Button>(Resource.Id.buttonSort);
            buttonSort.Click += buttonSortBy_Click;

            buttonCategory = FindViewById<Button>(Resource.Id.buttonCategory);
            buttonCategory.Click += buttonCategory_Click;
            searchResultPlaceHolder = rootView.FindViewById<LinearLayout>(Resource.Id.layoutSearchAdLinearLayout);
        }

        void buttonCategory_Click(object sender, EventArgs e)
        {
            Intent categorySelectionIntent = new Intent(this, typeof(ActivityCategory));
            StartActivityForResult(categorySelectionIntent, CategorySelectionRequestCode);
        }

        private void buttonSortBy_Click(object sender, EventArgs eventArgs)
        {
            Intent OrderByIntent = new Intent(this, typeof(ActivitySortBy));
            StartActivityForResult(OrderByIntent, OrderByRequestCode);
        }

        void buttonFilter_Click(object sender, EventArgs e)
        {
            Intent searchFilterIntent = new Intent(this, typeof(ActivitySearchFilter));
            StartActivityForResult(searchFilterIntent, SearchFilterRequestCode);
        }

       
        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (requestCode == LocationSelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("locationSelectionChanged", false))
                    resetSearchCondition();
            }
            if (requestCode == CategorySelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("categorySelectionChanged", false))
                    resetSearchCondition();
            }
            if (requestCode == SearchFilterRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("SearchFilterChanged", false))
                    resetSearchCondition();
            }
            if (requestCode == OrderByRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("OrderByChanged", false))
                    resetSearchCondition();
            }
        }
        private void resetSearchCondition()
        {
            searchResultPlaceHolder.RemoveAllViews();
            _adApi.ResetSearchCondition();
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
        private void addAdvertisementOnPage(AdvertisementCommon advertisementCommon, LinearLayout.LayoutParams layoutParams)
        {
            ViewGroupSingleAd viewGroupSingleAd = cretateNewViewSingleAd(advertisementCommon);
            searchResultPlaceHolder.AddView(viewGroupSingleAd, layoutParams);
        }
        private ViewGroupSingleAd cretateNewViewSingleAd(AdvertisementCommon advertisementCommon)
        {
            return new ViewGroupSingleAd(this)
            {
                AdTitle = advertisementCommon.AdvertisementTitle + ", " + advertisementCommon.CityName,
                AdPrice = advertisementCommon.AdvertisementPrice.PriceString,
                AdImage = advertisementCommon.AdvertisementImages[0],
                AdCategoryId = advertisementCommon.AdvertisementCategoryId,
                AdGuid = advertisementCommon.AdvertisementId,
                AdNumberOfVisit = advertisementCommon.NumberOfVisit
            };
        }

       

        public void OnSearchAdError(Exception ex)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            Toast.MakeText(ApplicationContext, ex.Message, ToastLength.Short).Show();
        }
    }
}