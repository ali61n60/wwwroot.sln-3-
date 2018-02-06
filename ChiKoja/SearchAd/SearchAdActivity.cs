using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using ChiKoja.NavigationDrawer;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace ChiKoja.SearchAd
{
    [Activity(Label = "ActivitySearchAd", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class SearchAdActivity : NavActivity
    {
        private SearchAdFragment searchAdFragment;
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
            FrameLayout leftFrameLayout = FindViewById<FrameLayout>(Resource.Id.frame_layout_left);
            searchAdFragment=new SearchAdFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.frame_layout_left, searchAdFragment)
                .Commit();
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (requestCode == LocationSelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("locationSelectionChanged", false))
                    searchAdFragment.resetSearchCondition();
            }
            if (requestCode == CategorySelectionRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("categorySelectionChanged", false))
                    searchAdFragment.resetSearchCondition();
            }
            if (requestCode == SearchFilterRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("SearchFilterChanged", false))
                    searchAdFragment.resetSearchCondition();
            }
            if (requestCode == OrderByRequestCode)
            {
                if (data == null) return;
                if (data.GetBooleanExtra("OrderByChanged", false))
                    searchAdFragment.resetSearchCondition();
            }
        }
    }
}