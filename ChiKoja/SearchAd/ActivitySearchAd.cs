using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Json;
using System.Net;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository;
using ChiKoja.Repository.Location;
using ChiKoja.CustomViews.SingleAdView;
using ChiKoja.AdCommonService;
using ChiKoja.Category;
using ChiKoja.Notification;
using ChiKoja.Services;
using ModelStd.Services;
using Newtonsoft.Json;
using AdvertisementCommon = ModelStd.Advertisements.AdvertisementCommon;
using V7Toolbar = Android.Support.V7.Widget.Toolbar;


namespace ChiKoja.SearchAd
{
    [Activity(Label = "ActivitySearchAd", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class ActivitySearchAd : NavActivity, ISearchAdResult
    {
        protected const int CategorySelectionRequestCode = 2;
        SearchAdService _searchAdService;

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
                FindViewById<FrameLayout>(Resource.Id
                    .content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            rootView = LayoutInflater.Inflate(Resource.Layout.SearchAd, contentFrameLayout);
        }

        private void initializeFields()
        {
            _searchAdService = new SearchAdService();

            buttonSearchAd = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSearch);
            buttonSearchAd.Click += buttonSearchAd_Click;

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

        async void buttonSearchAd_Click(object sender, EventArgs e)
        {
            // _searchAdService.GetAdFromServer(this);
            // MessageShower.GetMessageShower(this).ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
            Dictionary<string,string> userInputDictionary=new Dictionary<string, string>();
            userInputDictionary["StartIndex"] = "12";
            userInputDictionary["Count"] = "4";
            userInputDictionary["CategoryId"] = "27";
            userInputDictionary["RequestIndex"] = "345";

            try
            {
                string url = "http://192.168.42.76/api/AdApi/GetAdvertisementCommon";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(url));
                request.ContentType = "application/json";
                request.Method = "POST";
                using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    // [FromQuery]
                    //  int startIndex,
                    //     [FromQuery] int count,
                    //    [FromQuery] Dictionary<string, string> userInput

                    // string jsonData = "<form>{\"startIndex\":\"5\"}</form>";
                    //"count:\"23\"}</form>";
                    //  Dictionary<string, string> userInputDictionary = new Dictionary<string, string>();
                    //  userInputDictionary["Name"] = "Ali Nejati";
                    //MethodParam myMethodParam = new MethodParam() { Name = "Ali Nejati", Phone = "0912" };
                    //string jsonData = "{\"Name\":\"Ali Nejati\"," +
                    //               "\"Phone\":\"09122012908\"}";
                    //  jsonData += JsonConvert.SerializeObject(userInputDictionary);
                    string jsonData = JsonConvert.SerializeObject(userInputDictionary);
                    streamWriter.Write(jsonData);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                // Send the request to the server and wait for the response:
                using (WebResponse response = await request.GetResponseAsync())
                {
                    
                    
                    // Get a stream representation of the HTTP web response:
                    using (Stream stream = response.GetResponseStream())
                    {
                        // Use this stream to build a JSON document object:
                        JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
                        ResponseBase<AdvertisementCommon[]> result =
                            JsonConvert.DeserializeObject<ResponseBase<AdvertisementCommon[]>>(jsonDoc.ToString());
                        Toast.MakeText(this, result.Message, ToastLength.Long).Show();
                    }
                }
            }
            catch (Exception ex)
            {
                Toast.MakeText(this, ex.Message, ToastLength.Long).Show();
            }
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
            _searchAdService.ResetSearchCondition();
        }

        public void OnSerachAdCompleted(ResponseBaseOfArrayOfAdvertisementCommongJiz6K1p response, bool InResponseToLastRequest)
        {
            if (!InResponseToLastRequest)
                return;

            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            LinearLayout.LayoutParams layoutParams =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
            layoutParams.SetMargins(0, 20, 0, 20);

          //  if (response.Success)
             //   foreach (AdvertisementCommon advertisementCommon in response.ResponseData)
              //      addAdvertisementOnPage(advertisementCommon, layoutParams);
          //  else
           //     Toast.MakeText(ApplicationContext, response.Message, ToastLength.Long).Show();
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
                AdPrice = advertisementCommon.AdvertisementPrice.price.ToString(),
                AdImage = advertisementCommon.AdvertisementImages[0],
                AdCategoryId = advertisementCommon.AdvertisementCategoryId,
              //  AdGuid = Guid.Parse(advertisementCommon.AdvertisementId),
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