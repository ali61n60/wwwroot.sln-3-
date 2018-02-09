using Android.App;
using Android.OS;
using Android.Widget;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.NavigationDrawer;
using ModelStd.Db.Ad;

namespace ChiKoja.AdDetail
{
    [Activity(Label = "AdDetailActivity", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class AdDetailActivity:NavActivity
    {
        //TODO show similar ads
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            addFragments();
        }

        private void inflateView()
        {
            //TODO make error handling better
            if (!Intent.HasExtra(Advertisement.AdGuidKey))
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
            addTopTop();
            addMain();
            addContactOwner();
        }

        
        private void addTopTop()
        {
            AdDetailTopTopFragment adDetailTopTopFragment = new AdDetailTopTopFragment();
            Bundle args=new Bundle();
            args.PutString(Advertisement.AdGuidKey, Intent.GetStringExtra(Advertisement.AdGuidKey));
            adDetailTopTopFragment.Arguments = args;
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.top_top, adDetailTopTopFragment)
                .Commit();
        }

        private void addMain()
        {
            int categoryId = Intent.GetIntExtra(Category.CategoryIdKey, Category.CategoryIdDefault);
            Android.Support.V4.App.Fragment categorySpecificFragment = AdViewContainer.GetAdDetailViewFragment(categoryId);
            Bundle args = new Bundle();
            args.PutString(Advertisement.AdGuidKey, Intent.GetStringExtra(Advertisement.AdGuidKey));
            categorySpecificFragment.Arguments = args;
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.main, categorySpecificFragment)
                .Commit();
        }
        private void addContactOwner()
        {
            //TODO give data neede for this fragment
            
            AdDetailContactOwner adDetailContactOwner = new AdDetailContactOwner();
            Bundle args = new Bundle();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.contact_owner, adDetailContactOwner)
                .Commit();
        }


    }
}