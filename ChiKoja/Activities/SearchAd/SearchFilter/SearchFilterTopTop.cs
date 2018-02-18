using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchFilterTopTop:Fragment
    {
        private Context _context;
        View rootView;
        ImageButton imageButtonBack;

        public SearchFilterTopTop()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.search_filter_toptop_frag, container, false);

            initializeFields();
            initializeEvents();

            return rootView;
        }

        private void initializeFields()
        {
            imageButtonBack = rootView.FindViewById<ImageButton>(Resource.Id.imageButtonBack);
            imageButtonBack.Click += (sender, args) =>
            {
                Activity.Finish();
            };
        }

        private void initializeEvents()
        {

        }
        
    }
}