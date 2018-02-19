﻿using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.Activities.SearchAd.SearchFilter;
using ChiKoja.ArrayAdapters.SingleAd;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Notification;
using ChiKoja.Repository;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.Activities.SearchAd
{
    public class SearchAdMainFragment : Fragment
    {
        int _start = 1;
        int _initalStart = 1;
        int _count = 15;

        private string StartIndexKey = "StartIndex";
        private string CountKey = "Count";
        
        private SingleAdArrayAdapter _singleAdArrayAdapter;
        private ISingleAdEvents _singleAdEvents;
        private Context _context;
        View _rootView;
        
        AppCompatButton _buttonSearchAd;
       
        private ListView _listViewAdCommon;
        
        IAdApi _adApi;

        // ReSharper disable once EmptyConstructor
        public SearchAdMainFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            _rootView = inflater.Inflate(Resource.Layout.search_ad_main_frag, container, false);

            initializeFields();
            initializeEvents();

            return _rootView;
        }

        public override void OnAttach(Context context)
        {
            base.OnAttach(context);
            _context = context;
            if (context is ISingleAdEvents)
            {
                _singleAdEvents = context as ISingleAdEvents;
            }
            else
            {
                throw new Exception("context must implement SingleAdEvents Interface");
            }
        }

        private void initializeFields()
        {
            _singleAdArrayAdapter = new SingleAdArrayAdapter(_context,
                Android.Resource.Layout.SimpleListItem1,
                new List<AdvertisementCommon>());

            _listViewAdCommon = _rootView.FindViewById<ListView>(Resource.Id.listViewAdCommon);
            _listViewAdCommon.Adapter = _singleAdArrayAdapter;

            _adApi = Bootstrapper.container.GetInstance<IAdApi>();
            _buttonSearchAd = _rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSearch);
        }

        private void initializeEvents()
        {
            _buttonSearchAd.Click += async (sender, args) =>
            {
                GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
                Dictionary<string, string> userInputDictionary = createUserInputDictionary();
                
                ResponseBase<AdvertisementCommon[]> response = await _adApi.GetAdvertisementCommon(userInputDictionary);
                if (response.Success)
                    onSerachAdCompleted(response);
                else
                    onSearchAdError(new Exception(response.Message + ", ErrorCode:" + response.ErrorCode));
            };
            
            _listViewAdCommon.ItemClick += (sender, args) =>
            {
                AdvertisementCommon clickedAdCommon = _singleAdArrayAdapter.GetItem(args.Position);
                _singleAdEvents.OnSingleAdSelected(clickedAdCommon);// inform activity
            };
        }

        private Dictionary<string, string> createUserInputDictionary()
        {
            Dictionary<string, string> userInputDictionary=new Dictionary<string, string>();
            userInputDictionary[StartIndexKey] = _start.ToString();
            userInputDictionary[CountKey] = _count.ToString();
            CategoryRepository categoryRepository = new CategoryRepository(Repository.Repository.DataBasePath);
            int selectedCategoryId = categoryRepository.GetSelectedCategoryId();
            userInputDictionary[Category.CategoryIdKey] = selectedCategoryId.ToString();
           //TODO add common parameters
           //add category specific parameters
            SearchFilterCategorySpecificBaseCriteria categorySpecificSearchFilterFragment= AdViewContainer.GetCategorySpecificSearchFilterViewFragment(selectedCategoryId);
            categorySpecificSearchFilterFragment.FillCategorySpecificUserInputSearchFilter(userInputDictionary);

            return userInputDictionary;
        }

        public void resetSearchCondition()
        {
            //TODO maybe you should remove items from array adapter
            _listViewAdCommon.RemoveAllViews();
            _start = _initalStart;
            
        }

        private void onSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            if (response.Success)
            {
                _start += response.ResponseData.Length;
                _singleAdArrayAdapter.AddItemsToList(response.ResponseData);
                ((SingleAdArrayAdapter)_listViewAdCommon.Adapter).NotifyDataSetChanged();
            }
            else
                Toast.MakeText(_context, response.Message, ToastLength.Long).Show();
        }

        private void onSearchAdError(Exception ex)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            Toast.MakeText(_context, ex.Message, ToastLength.Short).Show();
        }
    }
}