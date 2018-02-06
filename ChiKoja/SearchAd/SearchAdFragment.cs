using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.Categories;
using ChiKoja.CustomViews.SingleAdView;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Models;
using ChiKoja.Notification;
using ChiKoja.Services.Server.Interfaces;
using ChiKoja.SingleAds;
using ModelStd.Advertisements;
using ModelStd.Advertisements.Price;
using ModelStd.Services;

namespace ChiKoja.SearchAd
{
    public class SearchAdFragment:Fragment
    {
        private SingleAdArrayAdapter _singleAdArrayAdapter;
        private Context _context;
        View rootView;
        
        Button buttonFilter;

        Button buttonSort;
        AppCompatButton buttonSearchAd;

        Button buttonCategory;
        //LinearLayout searchResultPlaceHolder;
        private ListView listViewAdCommon;

        private CategorySelection _categorySelection;
        IAdApi _adApi;

        public SearchAdFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView= inflater.Inflate(Resource.Layout.serarch_fragment, container, false);
            
            initializeFields();
            initializeEvents();

            return rootView;
        }
        
        public override void OnAttach(Context context)
        {
            base.OnAttach(context);
            _context = context;
        }

        private void initializeFields()
        {
            _singleAdArrayAdapter=new SingleAdArrayAdapter(_context,
                Android.Resource.Layout.SimpleListItem1,
                new List<AdvertisementCommon>()
                {
                    new AdvertisementCommon()
                    {
                        AdvertisementTitle = "hello",
                        NumberOfVisit = 10,
                        AdvertisementPrice = new AgreementPrice(),
                        AdvertisementImages = new string[10]
                    }
                });
            
            listViewAdCommon = rootView.FindViewById<ListView>(Resource.Id.listViewAdCommon);
         listViewAdCommon.Adapter = _singleAdArrayAdapter;
           
                
                _adApi = Bootstrapper.container.GetInstance<IAdApi>();
            buttonSearchAd = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSearch);
            buttonFilter = rootView.FindViewById<Button>(Resource.Id.buttonFilter);
            buttonSort = rootView.FindViewById<Button>(Resource.Id.buttonSort);
            buttonCategory = rootView.FindViewById<Button>(Resource.Id.buttonCategory);
            //searchResultPlaceHolder = rootView.FindViewById<LinearLayout>(Resource.Id.layoutSearchAdLinearLayout);
            
            _categorySelection = new CategorySelection();
        }

       private void initializeEvents()
        {
            buttonSearchAd.Click += async (sender, args) =>
            {
                GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
                ResponseBase<AdvertisementCommon[]> response = await _adApi.GetAdvertisementCommon();
                if (response.Success)
                    OnSerachAdCompleted(response);
                else
                    OnSearchAdError(new Exception(response.Message + ", ErrorCode:" + response.ErrorCode));
            };

            buttonFilter.Click += buttonFilter_Click;

            buttonSort.Click += buttonSortBy_Click;

            buttonCategory.Click += buttonCategory_Click;

            _categorySelection.SelectedCategoryCahnged += (sender, args) =>
            {
             
            };
        }

        void buttonCategory_Click(object sender, EventArgs e)
        {

            Intent categorySelectionIntent = new Intent(_context, typeof(ActivityCategory));

            categorySelectionIntent.PutExtra("CategorySelection", _categorySelection);
            StartActivityForResult(categorySelectionIntent, SearchAdActivity.CategorySelectionRequestCode);
        }

        private void buttonSortBy_Click(object sender, EventArgs eventArgs)
        {
            Intent OrderByIntent = new Intent(_context, typeof(ActivitySortBy));
            StartActivityForResult(OrderByIntent, NavigationDrawer.NavActivity.OrderByRequestCode);
            
        }

        void buttonFilter_Click(object sender, EventArgs e)
        {
            Intent searchFilterIntent = new Intent(_context, typeof(ActivitySearchFilter));
            StartActivityForResult(searchFilterIntent, NavigationDrawer.NavActivity.SearchFilterRequestCode);
        }

        public void resetSearchCondition()
        {
            //searchResultPlaceHolder.RemoveAllViews();
           listViewAdCommon.RemoveAllViews();
            _adApi.ResetSearchCondition();
        }
        public void addAdvertisementOnPage(AdvertisementCommon advertisementCommon, LinearLayout.LayoutParams layoutParams)
        {
            ViewGroupSingleAd viewGroupSingleAd = cretateNewViewSingleAd(advertisementCommon);
            //searchResultPlaceHolder.AddView(viewGroupSingleAd, layoutParams);
           
        }

        private ViewGroupSingleAd cretateNewViewSingleAd(AdvertisementCommon advertisementCommon)
        {
            return new ViewGroupSingleAd(_context)
            {
                AdTitle = advertisementCommon.AdvertisementTitle + ", " + advertisementCommon.CityName,
                AdPrice = advertisementCommon.AdvertisementPrice.PriceString,
                AdImage = advertisementCommon.AdvertisementImages[0],
                AdCategoryId = advertisementCommon.AdvertisementCategoryId,
                AdGuid = advertisementCommon.AdvertisementId,
                AdNumberOfVisit = advertisementCommon.NumberOfVisit
            };
        }

        public void OnSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            

            LinearLayout.LayoutParams layoutParams =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
            layoutParams.SetMargins(0, 20, 0, 20);
            //TODO use list instead 
            if (response.Success)
            {
                _singleAdArrayAdapter.AddItemsToList(response.ResponseData);
                ((SingleAdArrayAdapter)listViewAdCommon.Adapter).NotifyDataSetChanged();
                // listViewAdCommon.InvalidateViews();
               
                //foreach (AdvertisementCommon advertisementCommon in response.ResponseData)
                //  addAdvertisementOnPage(advertisementCommon, layoutParams);
            }
            else
                Toast.MakeText(_context, response.Message, ToastLength.Long).Show();
        }

        public void OnSearchAdError(Exception ex)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            Toast.MakeText(_context, ex.Message, ToastLength.Short).Show();
        }
    }
}