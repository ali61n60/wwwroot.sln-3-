using Android.App;
using Android.OS;
using Android.Widget;
using ChiKoja.NavigationDrawer;
using ModelStd.Db.Ad;

namespace ChiKoja.AdDetail
{
    [Activity(Label = "AdDetailActivity", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class AdDetailActivity:NavActivity
    {
        public static readonly string AdGuidKey = "AdGuid";
        
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            addFragments();
        }

        private void inflateView()
        {
            //TODO make error handling better
            if (!Intent.HasExtra(AdGuidKey))
            {
                Toast.MakeText(this, "Intent must conatin AdGuidKey and Value", ToastLength.Long).Show();
                return;
            }
            if (!Intent.HasExtra(Category.CategoryIdKey))
            {
                Toast.MakeText(this, "IntentmustContain CategoryIdKey and Value", ToastLength.Long).Show();
                return;
            }
            FrameLayout contentFrameLayout =
                FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            LayoutInflater.Inflate(Resource.Layout.ad_detail, contentFrameLayout);
            
        }

        private void addFragments()
        {
            int categoryId = Intent.GetIntExtra(Category.CategoryIdKey, Category.CategoryIdDefault);
            Android.Support.V4.App.Fragment categorySpecificFragment = getCategorySpecificFragment(categoryId);
            categorySpecificFragment.Arguments.PutString(AdGuidKey,Intent.GetStringExtra(AdGuidKey));
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.frame_layout_left, categorySpecificFragment)
                .Commit();
            
        }
        
        private Android.Support.V4.App.Fragment getCategorySpecificFragment(int categoryId)
        {
            return new AdDetailTransportationFragment();
        }
    }
}