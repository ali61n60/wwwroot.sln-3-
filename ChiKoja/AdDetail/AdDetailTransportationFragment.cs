using System;
using Android.OS;
using Android.Views;
using Android.Widget;
using ModelStd.Advertisements;


namespace ChiKoja.AdDetail
{
    public class AdDetailTransportationFragment : CategorySpecificBaseFragment
    {
        

        View rootView;
        AdvertisementTransportation advertisementTransportation;
        
        private TextView textViewBrand;
        private TextView textViewCarModel;
        private TextView textViewFuel;
        private TextView textViewGearbox;


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
            textViewBrand = rootView.FindViewById<TextView>(Resource.Id.textViewBrand);
            textViewBrand.Text = advertisementTransportation.BrandName;

            textViewCarModel = rootView.FindViewById<TextView>(Resource.Id.textViewCarModel);
            textViewCarModel.Text = advertisementTransportation.ModelName;

            textViewFuel = rootView.FindViewById<TextView>(Resource.Id.textViewFuel);
            textViewFuel.Text = advertisementTransportation.Fuel;

            textViewGearbox = rootView.FindViewById<TextView>(Resource.Id.textViewGearbox);
            textViewGearbox.Text = advertisementTransportation.Gearbox;
        }

        private void initializeEvents()
        {

        }
    }
}