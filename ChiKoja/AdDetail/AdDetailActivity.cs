using Android.App;
using Android.OS;
using Android.Widget;
using ChiKoja.NavigationDrawer;

namespace ChiKoja.AdDetail
{
    [Activity(Label = "AdDetailActivity", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class AdDetailActivity:NavActivity
    {
        public static readonly string AdGuidKey = "AdGuid";
        public static readonly string CategoryIdKey = "CategoryId";
        private readonly int CategoryIdDefault = 0;
        private TextView textView;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.ad_detail);
            int categoryId= Intent.GetIntExtra(CategoryIdKey, CategoryIdDefault);
            textView = FindViewById<TextView>(Resource.Id.textView1);
            textView.Text = "Hello From Ad Detail Activity. Category Id is:"+categoryId;

        }
    }
}