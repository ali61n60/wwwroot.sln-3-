using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;
using ChiKoja.AdDetail;
using ChiKoja.Interfaces.SingleAd;
using ChiKoja.NavigationDrawer;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;

//Activity to fragment  bundle and fragment.setArguments
namespace ChiKoja.SearchAd
{
    [Activity(Label = "ActivitySearchAd", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class SearchAdActivity : NavActivity, ISingleAdEvents
    {
        private SearchMain searchMain;
        private SearchFilter searchFilter;

        private readonly string AdTypeKey = "AdType";
        private readonly string SearchTextKey = "SearchText";
        
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
            LayoutInflater.Inflate(Resource.Layout.search_ad, contentFrameLayout);
        }

        private void addFragments()
        {
            addMain();
            addFilter();
        }

        private void addMain()
        {
            searchMain = new SearchMain();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.main, searchMain)
                .Commit();
        }

        private void addFilter()
        {
            searchFilter=new SearchFilter();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.filter, searchFilter)
                .Commit();
        }
        

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (requestCode == LocationSelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("locationSelectionChanged", false))
                    searchMain.resetSearchCondition();
            }
            if (requestCode == CategorySelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("categorySelectionChanged", false))
                    searchMain.resetSearchCondition();
            }
            if (requestCode == SearchFilterRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("SearchFilterChanged", false))
                    searchMain.resetSearchCondition();
            }
            if (requestCode == OrderByRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("OrderByChanged", false))
                    searchMain.resetSearchCondition();
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