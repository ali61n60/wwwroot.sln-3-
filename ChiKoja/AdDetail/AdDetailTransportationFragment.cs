using System;
using System.Threading.Tasks;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Support.V4.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Notification;
using ChiKoja.Repository.UserMarkedAds;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Services;


namespace ChiKoja.AdDetail
{
    public class AdDetailTransportationFragment : Fragment
    {
        //TODO Design UI for this fragment
        
        AdvertisementTransportation advertisementTransportation;

        LinearLayout linearLayoutImageContainer;

        View rootView;
        Button buttonContactInfo;
        
        private TextView textViewAdTitle;
        private TextView textViewBrand;

        
        Guid adGuid;
        private readonly int categoryId = 100;

        public AdDetailTransportationFragment() { }

        public override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            
            if (!Arguments.ContainsKey(Advertisement.AdGuidKey))
            {
                //TODO make error handling better
                Toast.MakeText(this.Activity, "IntentmustContain AdGuidKey and Value", ToastLength.Long).Show();
                return;
            }
            adGuid=Guid.Parse(Arguments.GetString(Advertisement.AdGuidKey));
            
        }
        
        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_transportation_fragment, container, false);
            return rootView;
        }

        public override async void OnResume()
        {
            base.OnResume();

            advertisementTransportation =await getAdDetailFromServer();
            initializeFields();
            initializeEvents();
        }

        private async Task<AdvertisementTransportation> getAdDetailFromServer()
        {
            AdvertisementTransportation advertisementTransportation = null;
            IAdApi adApi = Bootstrapper.container.GetInstance<IAdApi>();
            GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
            ResponseBase<AdvertisementCommon> response =await adApi.GetAdDetail(new AdDetailInfo()
            {
                AdGuid = adGuid.ToString(),
                CategoryId = categoryId
            });
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();
            if (response.Success)
            {
                try
                {
                    advertisementTransportation = (AdvertisementTransportation)response.ResponseData;
                }
                catch (Exception ex)
                {
                    //TODO show error to user
                    Toast.MakeText(Activity, ex.Message, ToastLength.Long).Show();
                }
            }

            else
            {
               GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(response.Message, ShowMessageType.Permanent);
            }

            return advertisementTransportation;
        }

        private void initializeFields()
        {
            
            linearLayoutImageContainer = rootView.FindViewById<LinearLayout>(Resource.Id.linearLayoutImageContainer);
            buttonContactInfo = rootView.FindViewById<Button>(Resource.Id.buttonContactInfo);
            
           

            textViewAdTitle = rootView.FindViewById<TextView>(Resource.Id.textViewAdTitle);
            textViewAdTitle.Text = advertisementTransportation.AdvertisementTitle;

            textViewBrand = rootView.FindViewById<TextView>(Resource.Id.textViewBrand);
            textViewBrand.Text = advertisementTransportation.BrandName;

            fillImageSection();
        }

        private void initializeEvents()
        {
            buttonContactInfo.Click += buttonContactInfo_Click;
        }
        

        

        void buttonContactInfo_Click(object sender, EventArgs e)
        {
            Android.App.Dialog contactInfoDialog = new Android.App.Dialog(Activity);
            contactInfoDialog.SetContentView(Resource.Layout.ContactInfoLayout);
            Button buttonCall = contactInfoDialog.FindViewById<Button>(Resource.Id.buttonCall);
            buttonCall.Click += (s, ev) =>
            {
                Intent dialIntent = new Intent(Intent.ActionDial, Android.Net.Uri.Parse("tel:" + advertisementTransportation.PhoneNumber));
                StartActivity(dialIntent);
            };
            Button buttonSendSms = contactInfoDialog.FindViewById<Button>(Resource.Id.buttonSendSMS);
            buttonSendSms.Click += (s, ev) =>
            {
                Intent dialIntent = new Intent(Intent.ActionSendto, Android.Net.Uri.Parse("smsto:" + advertisementTransportation.PhoneNumber));
                StartActivity(dialIntent);
            };
            TextView textViewPhoneNumber = contactInfoDialog.FindViewById<TextView>(Resource.Id.textViewPhoneNumber);
            textViewPhoneNumber.Text = advertisementTransportation.PhoneNumber;

            contactInfoDialog.Show();
        }

       
        
        
        private void fillImageSection()
        {
            if (advertisementTransportation == null || advertisementTransportation.AdvertisementImages == null)
                return;
            for (int i = 1; i < advertisementTransportation.AdvertisementImages.Length; i += 2)// just show big images
            {
                var imageView = new ImageView(Activity);
                setBitmapImage(imageView, advertisementTransportation.AdvertisementImages[i]);
                LinearLayout.LayoutParams layoutParams =
                    new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.WrapContent);
                
                layoutParams.SetMargins(10, 10, 10, 10);
                linearLayoutImageContainer.AddView(imageView, layoutParams);
            }
        }

        private void setBitmapImage(ImageView imageView, string base64String)
        {
            if (base64String != null)
            {
                byte[] decodedString = Base64.Decode(base64String, Base64Flags.Default);
                Bitmap decodedByte = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);
                imageView.SetImageBitmap(decodedByte);
            }
        }
    }
}