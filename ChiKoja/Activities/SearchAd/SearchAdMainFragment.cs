using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.ArrayAdapters.SingleAd;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Interfaces.SingleAd;
using ChiKoja.Notification;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.Activities.SearchAd
{
    public class SearchAdMainFragment : Fragment
    {
        private SingleAdArrayAdapter _singleAdArrayAdapter;
        private ISingleAdEvents _singleAdEvents;
        private Context _context;
        View rootView;
        
        AppCompatButton buttonSearchAd;
       
        private ListView listViewAdCommon;
        
        IAdApi _adApi;

        // ReSharper disable once EmptyConstructor
        public SearchAdMainFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.search_ad_main_frag, container, false);

            initializeFields();
            initializeEvents();

            return rootView;
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

            listViewAdCommon = rootView.FindViewById<ListView>(Resource.Id.listViewAdCommon);
            listViewAdCommon.Adapter = _singleAdArrayAdapter;

            _adApi = Bootstrapper.container.GetInstance<IAdApi>();
            buttonSearchAd = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSearch);
        }

        private void initializeEvents()
        {
            buttonSearchAd.Click += async (sender, args) =>
            {
                GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
                ResponseBase<AdvertisementCommon[]> response = await _adApi.GetAdvertisementCommon();
                if (response.Success)
                    onSerachAdCompleted(response);
                else
                    onSearchAdError(new Exception(response.Message + ", ErrorCode:" + response.ErrorCode));
            };
            
            listViewAdCommon.ItemClick += (sender, args) =>
            {
                AdvertisementCommon clickedAdCommon = _singleAdArrayAdapter.GetItem(args.Position);
                _singleAdEvents.OnSingleAdSelected(clickedAdCommon);// inform activity
            };
        }
        
        public void resetSearchCondition()
        {
            //TODO maybe you should remove items from array adapter
            listViewAdCommon.RemoveAllViews();
            _adApi.ResetSearchCondition();
        }

        private void onSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            if (response.Success)
            {
                _singleAdArrayAdapter.AddItemsToList(response.ResponseData);
                ((SingleAdArrayAdapter)listViewAdCommon.Adapter).NotifyDataSetChanged();
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