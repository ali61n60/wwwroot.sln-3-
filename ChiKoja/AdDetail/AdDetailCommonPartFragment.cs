using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using ModelStd.Advertisements;

namespace ChiKoja.AdDetail
{
    public class AdDetailCommonPartFragment:Fragment
    {
        private View rootView;
        private AppCompatTextView textViewAdTitle;
        private AppCompatTextView textViewPrice;
        AdvertisementCommon _advertisementCommon;

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_common_part, container, false);
            return rootView;
        }

       
        public void SetAdvertisementCommon(AdvertisementCommon advertisementCommon)
        {
            _advertisementCommon = advertisementCommon;
            initializeFields();
            initializeEvents();
        }

        private void initializeFields()
        {
            textViewAdTitle = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewAdTitle);
            textViewAdTitle.Text = _advertisementCommon.AdTitle;

            textViewPrice = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewPrice);
            textViewPrice.Text = _advertisementCommon.AdPrice.PriceString;
        }

        private void initializeEvents()
        {

        }
    }
}