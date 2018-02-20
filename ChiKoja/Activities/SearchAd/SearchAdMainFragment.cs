using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.Activities.SearchAd.SearchFilter;
using ChiKoja.ArrayAdapters.SingleAd;
using ChiKoja.Infrastructure;
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
        private int _start = 1;
        private const int InitalStart = 1;
        private int _count = 15;

        public int LocalSearchPrefChangeNumber { get; private set; }

        private const string StartIndexKey = "StartIndex";
        private const string CountKey = "Count";
        private const string SearchTextKey = "SearchText";


        private SingleAdArrayAdapter _singleAdArrayAdapter;
        private ISingleAdEvents _singleAdEvents;
        private Context _context;
        View _rootView;
        
        AppCompatButton _buttonSearchAd;
        private EditText _editTextSearchText;
       
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
            _adApi = Bootstrapper.container.GetInstance<IAdApi>();

            _singleAdArrayAdapter = new SingleAdArrayAdapter(_context,Android.Resource.Layout.SimpleListItem1,new List<AdvertisementCommon>());
            _listViewAdCommon = _rootView.FindViewById<ListView>(Resource.Id.listViewAdCommon);
            _listViewAdCommon.Adapter = _singleAdArrayAdapter;

            _buttonSearchAd = _rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSearch);
            _editTextSearchText = _rootView.FindViewById<EditText>(Resource.Id.editTextSearchText);
        }

        private void initializeEvents()
        {
            _buttonSearchAd.Click += async (sender, args) =>
            {
                GlobalApplication.GlobalApp.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
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

            _editTextSearchText.TextChanged += (sender, args) =>
            {
                ResetSearchCondition();
            };
        }

        private Dictionary<string, string> createUserInputDictionary()
        {
            Dictionary<string, string> userInputDictionary=new Dictionary<string, string>();
            userInputDictionary[StartIndexKey] = _start.ToString();
            userInputDictionary[CountKey] = _count.ToString();

            CategoryRepository categoryRepository = new CategoryRepository(Repository.Repository.DataBasePath);//TODO inject it
            int selectedCategoryId = categoryRepository.GetSelectedCategoryId();
            userInputDictionary[Category.CategoryIdKey] = selectedCategoryId.ToString();
            userInputDictionary[SearchTextKey] = _editTextSearchText.Text;
            //TODO Add AdType get it from frag search
            

            //searchFilterRepository.InsertSearchFilters(userInputDictionary);//insert search filter into user input to be sent to server
            //KeyValuePair<string, string> districtPair = districtRepository.GetDistrictDictionary();
            //userInputDictionary.Add(districtPair.Key, districtPair.Value);

            

            //TODO add common parameters
            //add category specific parameters
            SearchFilterCategorySpecificBaseCriteria categorySpecificSearchFilterFragment = AdViewContainer.GetCategorySpecificSearchFilterViewFragment(selectedCategoryId);
            categorySpecificSearchFilterFragment.FillCategorySpecificUserInputSearchFilter(userInputDictionary);

            return userInputDictionary;
        }

        public void ResetSearchCondition()
        {
            _singleAdArrayAdapter.Clear();
            _singleAdArrayAdapter.NotifyDataSetChanged();

            _start = InitalStart;

            LocalSearchPrefChangeNumber = AppPreferences.SearchPrefChangedNumber;
        }

        private void onSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response)
        {
            GlobalApplication.GlobalApp.GetMessageShower().ShowDefaultMessage();
            if (response.Success)
            {
                _start += response.ResponseData.Length;
                _singleAdArrayAdapter.AddItemsToList(response.ResponseData);
                _singleAdArrayAdapter.NotifyDataSetChanged();
            }
            else
                Toast.MakeText(_context, response.Message, ToastLength.Long).Show();
        }

        private void onSearchAdError(Exception ex)
        {
            GlobalApplication.GlobalApp.GetMessageShower().ShowDefaultMessage();
            Toast.MakeText(_context, ex.Message, ToastLength.Short).Show();
        }
    }
}