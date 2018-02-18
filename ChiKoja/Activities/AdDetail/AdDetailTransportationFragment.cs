using System;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
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

        private AppCompatTextView textViewPlateType;
        private AppCompatTextView textViewBodyColor;
        private AppCompatTextView textViewInternalColor;
        private AppCompatTextView textViewBodyStatus;
        private AppCompatTextView textViewCarStatus;
        private AppCompatTextView textViewMakeYear;
        private AppCompatTextView textViewMileage;


        Guid adGuid;
        private readonly int categoryId = 100;

        public AdDetailTransportationFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_transportation_frag, container, false);
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

            textViewPlateType = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewPlateType);
            textViewPlateType.Text = advertisementTransportation.PlateType;

            textViewBodyColor = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewBodyColor);
            textViewBodyColor.Text = advertisementTransportation.BodyColor;


            textViewInternalColor = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewInternalColor);
            textViewInternalColor.Text = advertisementTransportation.InternalColor;

            textViewBodyStatus = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewBodyStatus);
            textViewBodyStatus.Text = advertisementTransportation.BodyStatus;

            textViewCarStatus = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewCarStatus);
            textViewCarStatus.Text = advertisementTransportation.CarStatus;

            textViewMakeYear = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewMakeYear);
            textViewMakeYear.Text = advertisementTransportation.MakeYear.ToString();

            textViewMileage = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewMileage);
            textViewMileage.Text = advertisementTransportation.Mileage.ToString();

        }

        private void initializeEvents()
        {

        }
    }
}