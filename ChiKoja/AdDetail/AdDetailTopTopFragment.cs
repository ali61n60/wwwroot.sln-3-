using Android.OS;
using Android.Support.V4.App;
using Android.Views;

namespace ChiKoja.AdDetail
{
    public class AdDetailTopTopFragment:Fragment
    {

        //TODO make the view nicer and add functionallity
        View rootView;
        public AdDetailTopTopFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_toptop, container, false);
            return rootView;
        }
    }
}