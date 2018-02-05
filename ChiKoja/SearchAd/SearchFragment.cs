﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.Categories;
using ChiKoja.CustomViews.SingleAdView;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Models;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;

namespace ChiKoja.SearchAd
{
    public class SearchFragment:Fragment
    {
        private Context _context;
        View rootView;
        private TextView textView;
        Button buttonFilter;

        Button buttonSort;

        //Button buttonSearchAd;
        AppCompatButton buttonSearchAd;

        Button buttonCategory;
        LinearLayout searchResultPlaceHolder;

        private CategorySelection _categorySelection;
        IAdApi _adApi;

        public SearchFragment() { }

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
            _adApi = Bootstrapper.container.GetInstance<IAdApi>();
            buttonSearchAd = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSearch);
            buttonFilter = rootView.FindViewById<Button>(Resource.Id.buttonFilter);
            buttonSort = rootView.FindViewById<Button>(Resource.Id.buttonSort);
            buttonCategory = rootView.FindViewById<Button>(Resource.Id.buttonCategory);
            searchResultPlaceHolder = rootView.FindViewById<LinearLayout>(Resource.Id.layoutSearchAdLinearLayout);
            textView = rootView.FindViewById<TextView>(Resource.Id.textView);
            _categorySelection = new CategorySelection();
        }

       private void initializeEvents()
        {
            buttonSearchAd.Click += async (sender, args) =>
            {
                _categorySelection.SelectedCategoryId++;
                //GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
                //ResponseBase<AdvertisementCommon[]> response = await _adApi.GetAdvertisementCommon();
                //if(response.Success)
                //    OnSerachAdCompleted(response);
                //else
                //    OnSearchAdError(new Exception(response.Message+", ErrorCode:"+response.ErrorCode));
            };

            buttonFilter.Click += buttonFilter_Click;

            buttonSort.Click += buttonSortBy_Click;

            buttonCategory.Click += buttonCategory_Click;

            _categorySelection.SelectedCategoryCahnged += (sender, args) =>
            {
                textView.Text = args.SelectedCategoryId.ToString();
            };
        }

        void buttonCategory_Click(object sender, EventArgs e)
        {

            Intent categorySelectionIntent = new Intent(_context, typeof(ActivityCategory));

            categorySelectionIntent.PutExtra("CategorySelection", _categorySelection);
            StartActivityForResult(categorySelectionIntent, ActivitySearchAd.CategorySelectionRequestCode);
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
            searchResultPlaceHolder.RemoveAllViews();
            _adApi.ResetSearchCondition();
        }
        public void addAdvertisementOnPage(AdvertisementCommon advertisementCommon, LinearLayout.LayoutParams layoutParams)
        {
            ViewGroupSingleAd viewGroupSingleAd = cretateNewViewSingleAd(advertisementCommon);
            searchResultPlaceHolder.AddView(viewGroupSingleAd, layoutParams);
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
    }
}