using System;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ModelStd.Advertisements;


namespace ChiKoja.AdDetail
{
    public class AdDetailTransportationFragment : CategorySpecificBaseFragment
    {
        

        View rootView;
        AdvertisementTransportation advertisementTransportation;
        
        private AppCompatTextView textViewBrand;
        private AppCompatTextView textViewCarModel;
        private AppCompatTextView textViewFuel;
        private AppCompatTextView textViewGearbox;


        Guid adGuid;
        private readonly int categoryId = 100;

        public AdDetailTransportationFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_transportation_fragment, container, false);
            return rootView;
        }

        public override void SetAdDetailData(AdvertisementCommon adDetail)
        {
            if (adDetail is AdvertisementTransportation)
            {
                advertisementTransportation=adDetail as AdvertisementTransportation;
                initializeFields();
                initializeEvents();
            }
            else
            {
                //TODO show error to user
                throw new Exception("input parameter must be of type AdvertisementTransportation");
            }
        }
        
        private void initializeFields()
        {
            textViewBrand = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewBrand);
            textViewBrand.Text = advertisementTransportation.BrandName;

            textViewCarModel = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewCarModel);
            textViewCarModel.Text = advertisementTransportation.ModelName;

            textViewFuel = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewFuel);
            textViewFuel.Text = advertisementTransportation.Fuel;

            textViewGearbox = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewGearbox);
            textViewGearbox.Text = advertisementTransportation.Gearbox;
        }

        private void initializeEvents()
        {

        }
    }
}