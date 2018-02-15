using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.ArrayAdapters.SingleAd;
using ChiKoja.Categories;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Interfaces.SingleAd;
using ChiKoja.Models;
using ChiKoja.Notification;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.SearchAd
{

    //TODO handle click event of listViewAdCommon
    //TODO remove unused ViewGroupSingleAd
    public class SearchAdFragment : Fragment
    {
        private SingleAdArrayAdapter _singleAdArrayAdapter;
        private ISingleAdEvents _singleAdEvents;
        private Context _context;
        View rootView;
        Button buttonFilter;
        Button buttonSort;
        AppCompatButton buttonSearchAd;
        
        Button buttonCategory;
        private ListView listViewAdCommon;
        private CategorySelection _categorySelection;
        IAdApi _adApi;

        // ReSharper disable once EmptyConstructor
        public SearchAdFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.serarch_fragment, container, false);

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
            buttonFilter = rootView.FindViewById<Button>(Resource.Id.buttonFilter);
            buttonSort = rootView.FindViewById<Button>(Resource.Id.buttonSort);
            buttonCategory = rootView.FindViewById<Button>(Resource.Id.buttonCategory);


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

            listViewAdCommon.ItemClick += (sender, args) =>
            {
                AdvertisementCommon clickedAdCommon = _singleAdArrayAdapter.GetItem(args.Position);
                _singleAdEvents.OnSingleAdSelected(clickedAdCommon);// inform activity
            };

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
            Intent orderByIntent = new Intent(_context, typeof(ActivitySortBy));
            StartActivityForResult(orderByIntent, NavigationDrawer.NavActivity.OrderByRequestCode);
        }

        void buttonFilter_Click(object sender, EventArgs e)
        {
            Intent searchFilterIntent = new Intent(_context, typeof(ActivitySearchFilter));
            StartActivityForResult(searchFilterIntent, NavigationDrawer.NavActivity.SearchFilterRequestCode);
        }

        public void resetSearchCondition()
        {
            //TODO maybe you should remove items from array adapter
            listViewAdCommon.RemoveAllViews();
            _adApi.ResetSearchCondition();
        }

        public void OnSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response)
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

        public void OnSearchAdError(Exception ex)
        {
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            Toast.MakeText(_context, ex.Message, ToastLength.Short).Show();
        }
    }
}