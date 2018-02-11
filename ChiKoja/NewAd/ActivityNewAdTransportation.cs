using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;
using ChiKoja.Repository;
using ChiKoja.Repository.CryptoGraphy;
using ChiKoja.Repository.TransportationRepository;
using ChiKoja.Services.Server;


namespace ChiKoja.NewAd
{
    [Activity(Label = "ActivityNewAdTransportation", Theme = "@style/Theme.Main")]
    public class ActivityNewAdTransportation : AppCompatActivity
    {
        
        //get Model based on brand
        /*
         set brand to first one
         update model besed on selected brand
         
         
          */

        
        
        //title
        //comment
        //location
        //offerType (for sale, free, request)
        //body status
        //fuel
        //gearbox
        //Car type (new, used, will be produced)
        //registrationType (national, free zone, temp)
        //interior color
        //exterior color
        //carType (sedan, Suv, pickUp, station, crook, cope)
        //Get Ad images
        Button buttonSendNewAd;
        Spinner spinnerBrand;
        Spinner spinnerModel;


       // AdvertisementTransportation adTransportation;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.new_ad_transportation);
            initializeFields();
        }

        private void initializeFields()
        {
            initSpinnerBrand();
         //   initSpinnerModel();
            buttonSendNewAd = FindViewById<Button>(Resource.Id.buttonSendNewAd);
            buttonSendNewAd.Click += buttonSendNewAd_Click;
        }

        private void initSpinnerBrand()
        {
           // spinnerBrand = FindViewById<Spinner>(Resource.Id.spinnerBrand);
           // ArrayAdapterTransportationBrand arrayAdapterBrand =
           //     new ArrayAdapterTransportationBrand(this,Android.Resource.Id.Text2);
           // fillArrayAdapterBrand(arrayAdapterBrand);
           // spinnerBrand.Adapter = arrayAdapterBrand;
           // spinnerBrand.SetSelection(0);//////////////
           //// selectedBrand = ((ArrayAdapterTransportationBrand)spinnerBrand.Adapter).GetItem(0);
           // spinnerBrand.ItemSelected += spinnerBrand_ItemSelected;
        }

       // TransportationBrand selectedBrand;
        void spinnerBrand_ItemSelected(object sender, AdapterView.ItemSelectedEventArgs e)
        {
            //selectedBrand= ((ArrayAdapterTransportationBrand) spinnerBrand.Adapter).GetItem(e.Position);
        //    updateSpinnerModel();
        }

        //private void fillArrayAdapterBrand(ArrayAdapterTransportationBrand arrayAdapterBrand)
        //{
        //    //get transformation brands from database
        //    TransportationBrandRepository transportationBrandRepository=new TransportationBrandRepository(Repository.Repository.DataBasePath);
        //    //TransportationBrand[] allBrands= transportationBrandRepository.GetAll(Repository.Repository.Locker);
        //    //arrayAdapterBrand.AddAll(allBrands);
        //}

        //ArrayAdapterTransportationModel arrayAdapterModel;
        //private void initSpinnerModel()
        //{
        //    spinnerModel = FindViewById<Spinner>(Resource.Id.spinnerModel);
        //    arrayAdapterModel = new ArrayAdapterTransportationModel(this, Android.Resource.Id.Text2);
        //    //fillArrayAdapterModel(arrayAdapterModel);
        //    updateSpinnerModel();
        //    spinnerModel.Adapter = arrayAdapterModel;
        //}
        //private void updateSpinnerModel()
        //{
        //    TransportationModelRepository transportationModelRepository = new TransportationModelRepository(Repository.Repository.DataBasePath);
        //    //TransportationModel[] allModelsInBrand = transportationModelRepository
        //   //     .GetAllModelsInBrand(Repository.Repository.Locker,selectedBrand.BrandId);
        //    arrayAdapterModel.Clear();
        //  //  arrayAdapterModel.AddAll(allModelsInBrand);
        //}

        void buttonSendNewAd_Click(object sender, EventArgs e)
        {
            
        //    adTransportation = new AdvertisementTransportation
          //  {
         //       AdvertisementCommon = new AdvertisementCommon()
          //  };

            fillAdDataBasedOnUserInput();
            AdTransportationApi adTransportationApi = new AdTransportationApi();
            Registration registration = new Registration();
            CryptoGraphy cryptoGraphy = new CryptoGraphy();
         //   ResponseBase response = adTransportationApi.AddNewAdvertisementTransportation
          //      (adTransportation, cryptoGraphy.EncryptWithServerKey(registration.UserName),
          //      cryptoGraphy.EncryptWithServerKey(registration.Password));
          //  Toast.MakeText(this, response.Message, ToastLength.Long).Show();
        }

        private void fillAdDataBasedOnUserInput()
        {
            //adTransportation.BodyColor = "Blackwwwwwwww";
            //adTransportation.BodyStatus = BodyStatus.NoAccident;
            //adTransportation.Gearbox = "Automatic";
            //adTransportation.InternalColor = "Whiteeeee";
            //adTransportation.BrandId = 18;
            //adTransportation.ModelId = 204;
            //adTransportation.AdvertisementCommon.DistrictId = 29;
            //adTransportation.AdvertisementCommon.AdvertisementCategoryId = 100;
            //Price adPrice = new Price
            //{
            //    PriceType = PriceType.ForSale,
            //    price = 1234
            //};
            //adTransportation.AdvertisementCommon.AdvertisementPrice = adPrice;

            //adTransportation.AdvertisementCommon.AdvertisementTitle = "AndroidTestTitle";
            //adTransportation.AdvertisementCommon.AdvertisementComments = "Android comment test";
            //adTransportation.AdvertisementCommon.AdPrivilageId = 1;//TODO create Enum
        }
    }

  //  public class ArrayAdapterTransportationBrand : ArrayAdapter<TransportationBrand>
    //{
    //    public ArrayAdapterTransportationBrand(Context context, int textViewResourceId)
    //        : base(context, textViewResourceId){}
    //    public override View GetView(int position, View convertView, ViewGroup parent)
    //    {
    //        return createView(parent.Context,convertView, GetItem(position));
    //    }
    //    public override View GetDropDownView(int position, View convertView, ViewGroup parent)
    //    {
    //        return createView(parent.Context,convertView, GetItem(position));
    //    }
    //    private View createView(Context context,View convertView, TransportationBrand brand)
    //    {
    //        TextView textView;
    //        if (convertView == null)
    //        {
    //            textView = new TextView(context)
    //            {
    //                Gravity = GravityFlags.Center,
    //                TextSize = context.Resources.GetDimension(Resource.Dimension.mediumTextSize)/2
    //            };
    //        }
    //        else
    //            textView = (TextView) convertView;

    //        textView.Text = brand.BrandName;
    //        return textView;
    //    }
    //}

   

    //public class ArrayAdapterTransportationModel : ArrayAdapter<TransportationModel>
    //{
    //    public ArrayAdapterTransportationModel(Context context, int textViewResourceId)
    //        : base(context, textViewResourceId)
    //    {
    //    }
    //    public override View GetView(int position, View convertView, ViewGroup parent)
    //    {
    //        return createView(parent.Context, convertView, GetItem(position));
    //    }
    //    public override View GetDropDownView(int position, View convertView, ViewGroup parent)
    //    {
    //        return createView(parent.Context, convertView, GetItem(position));
    //    }

    //    private View createView(Context context, View convertView, TransportationModel model)
    //    {
    //        TextView textView;
    //        if (convertView == null)
    //        {
    //            textView = new TextView(context)
    //            {
    //                Gravity = GravityFlags.Center,
    //                TextSize = context.Resources.GetDimension(Resource.Dimension.mediumTextSize)/2
    //            };
    //        }
    //        else
    //            textView = (TextView)convertView;

    //        textView.Text = model.ModelName;
    //        return textView;
    //    }
    }
