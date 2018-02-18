using Android.OS;
using Android.Support.V4.App;
using Android.Views;

namespace ChiKoja.Activities.AdDetail
{
    public class AdDetailWarningFragment:Fragment
    {
        private View rootView;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_warning_frag, container, false);
            return rootView;
        }

        public override async void OnResume()
        {
            base.OnResume();

            initializeFields();
            initializeEvents();
        }

        private void initializeFields()
        {

        }

        private void initializeEvents()
        {

        }
    }
}