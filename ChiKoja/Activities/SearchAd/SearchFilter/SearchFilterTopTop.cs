using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchFilterTopTop:Fragment
    {
        private Context _context;
        View rootView;
        AppCompatButton buttonReturn;

        public SearchFilterTopTop()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            //rootView = inflater.Inflate(Resource.Layou, container, false);

            initializeFields();
            initializeEvents();
           

            return rootView;
        }

        private void initializeFields()
        {
            //buttonReturn = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonReturn);
            //buttonReturn.Click += buttonReturn_Click;
        }

        private void initializeEvents()
        {

        }
        
    }
}