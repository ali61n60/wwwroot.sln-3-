using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;
using ChiKoja.Activities.AdDetail;
using ChiKoja.Activities.SearchAd.SearchFilter;
using ChiKoja.NavigationDrawer;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;

//Activity to fragment  bundle and fragment.setArguments
namespace ChiKoja.Activities.SearchAd
{
    [Activity(Label = "ActivitySearchAd", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class SearchAdActivity : NavActivity, ISingleAdEvents
    {
        //Fragments
        private SearchAdMainFragment _searchAdMain;
        private SearchAdFilterFragment _searchAdFilter;

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
            LayoutInflater.Inflate(Resource.Layout.search_ad_act, contentFrameLayout);
        }

        private void addFragments()
        {
            addMainFrag();
            addFilterFrag();
        }

        private void addMainFrag()
        {
            _searchAdMain = new SearchAdMainFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.main, _searchAdMain)
                .Commit();
        }

        private void addFilterFrag()
        {
            _searchAdFilter=new SearchAdFilterFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.filter, _searchAdFilter)
                .Commit();
        }
        

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (requestCode == LocationSelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("locationSelectionChanged", false))
                    _searchAdMain.resetSearchCondition();
            }
            if (requestCode == CategorySelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("categorySelectionChanged", false))
                    _searchAdMain.resetSearchCondition();
            }
            if (requestCode == SearchFilterRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra(SearchFilterActivity.SearchFilterChangedKey, false))
                    _searchAdMain.resetSearchCondition();
            }
            if (requestCode == OrderByRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("OrderByChanged", false))
                    _searchAdMain.resetSearchCondition();
            }
        }

        public void OnSingleAdSelected(AdvertisementCommon adCommon)
        {
            //TODO show ad detail to user
            
            Intent adDetailIntent = new Intent(this, typeof(AdDetailActivity));
            adDetailIntent.PutExtra(Advertisement.AdGuidKey, adCommon.AdId.ToString());
            adDetailIntent.PutExtra(Category.CategoryIdKey, adCommon.CategoryId);
            StartActivity(adDetailIntent);
            
            Toast.MakeText(this,adCommon.AdId.ToString(),ToastLength.Long).Show();
        }
    }
}