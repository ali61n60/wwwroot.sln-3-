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
        
        private TextView textView;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
           

        }

        private void inflateView()
        {

            //TODO get adguid and category id from extra and based on that load category specific view in the fragment
            FrameLayout contentFrameLayout =
                FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            LayoutInflater.Inflate(Resource.Layout.ad_detail, contentFrameLayout);
            int categoryId = Intent.GetIntExtra(Category.CategoryIdKey,Category.CategoryIdDefault);
            textView = FindViewById<TextView>(Resource.Id.textView1);
            textView.Text = "Hello From Ad Detail Activity. Category Id is:" + categoryId;
        }
    }
}