using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using Android.Graphics;
using Android.Util;
using ChiKoja.NavigationDrawer;
using ChiKoja.Notification;
using ChiKoja.Repository.UserMarkedAds;
using ChiKoja.Services;
using ChiKoja.Services.Server;
using ModelStd.Advertisements;
using ModelStd.Services;
using Uri = Android.Net.Uri;

namespace ChiKoja.AdDetail
{

    //TODO show similar ads
    [Activity(Label = "AdTransportationActivity", Theme = "@style/Theme.Main")]
    public class AdDetailTransportationActivity : NavActivity,IAdDetailCallBack<ResponseBase<AdvertisementTransportation>>
    {
        //TODO Design UI for this activity

        AdTransportationApi adTransportationApi;
        ResponseBase<AdvertisementTransportation> response;
        AdvertisementTransportation advertisementTransportation;

        LinearLayout linearLayoutImageContainer;
        LinearLayout linearLayoutDataContainer;

        View rootView;
        Button buttonContactInfo;
        Button buttonMarkAd;
        UserMarkedAds userMarkedAds;
        Guid adGuid;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            if (!Intent.HasExtra(AdDetail.AdGuidKey))
            {
                //TODO error in input intent data. Inform user
                Finish();
            }
            adGuid = Guid.Parse(Intent.GetStringExtra(AdDetail.AdGuidKey));
            AdApi adApi = new AdApi();
            adApi.GetAdTransportationDetailFromServer(adGuid,this);

            GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall),ShowMessageType.Permanent);
            userMarkedAds=new UserMarkedAds(Repository.Repository.DataBasePath);

            FrameLayout contentFrameLayout = FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            rootView = LayoutInflater.Inflate(Resource.Layout.AdTransportationDetail, contentFrameLayout);
            InitializeViews();
        }

        private void InitializeViews()
        {
            linearLayoutImageContainer = rootView.FindViewById<LinearLayout>(Resource.Id.linearLayoutImageContainer);
            linearLayoutDataContainer = rootView.FindViewById<LinearLayout>(Resource.Id.linearLayoutDataContainer);
            buttonContactInfo = rootView.FindViewById<Button>(Resource.Id.buttonContactInfo);
            buttonContactInfo.Click += buttonContactInfo_Click;
            initializeButtonMarkAd();
        }

        private void initializeButtonMarkAd()
        {
            buttonMarkAd = rootView.FindViewById<Button>(Resource.Id.buttonMarkAd);
            buttonMarkAd.Click += buttonMarkAd_Click;
            manageButtonMarkAdText();
        }

        private void manageButtonMarkAdText()
        {
            if (userMarkedAds.IsAdMarked(Repository.Repository.Locker, adGuid))
                buttonMarkAd.Text = Resources.GetString(Resource.String.UnMarkAd);
            else
                buttonMarkAd.Text = Resources.GetString(Resource.String.MarkAd);
        }

        void buttonMarkAd_Click(object sender, EventArgs e)
        {
            if (userMarkedAds.IsAdMarked(Repository.Repository.Locker, adGuid))
                userMarkedAds.UnmarAd(Repository.Repository.Locker,adGuid);
            else
                userMarkedAds.MarkAd(Repository.Repository.Locker, adGuid);
            manageButtonMarkAdText();
        }

        void buttonContactInfo_Click(object sender, EventArgs e)
        {
            Android.App.Dialog contactInfoDialog = new Android.App.Dialog(this);
            contactInfoDialog.SetContentView(Resource.Layout.ContactInfoLayout);
            Button buttonCall = contactInfoDialog.FindViewById<Button>(Resource.Id.buttonCall);
            buttonCall.Click += (s, ev) =>
            {
                Intent dialIntent = new Intent(Intent.ActionDial, Uri.Parse("tel:" + advertisementTransportation.AdvertisementCommon.PhoneNumber));
                StartActivity(dialIntent);
            };
            Button buttonSendSms = contactInfoDialog.FindViewById<Button>(Resource.Id.buttonSendSMS);
            buttonSendSms.Click += (s, ev) =>
            {
                Intent dialIntent = new Intent(Intent.ActionSendto, Uri.Parse("smsto:" + advertisementTransportation.AdvertisementCommon.PhoneNumber));
                StartActivity(dialIntent);
            };
            TextView textViewPhoneNumber = contactInfoDialog.FindViewById<TextView>(Resource.Id.textViewPhoneNumber);
            textViewPhoneNumber.Text = advertisementTransportation.AdvertisementCommon.PhoneNumber;

            contactInfoDialog.Show();
        }

        /// <summary>
        /// this method is called back from AdApi class when adDetail is ready from servre
        /// </summary>
        /// <param name="response"></param>
        public void DataFromServer(ResponseBase<AdvertisementTransportation> response)
        {
            //TODO populate view from response, show error if response contains error
            GlobalApplication.GlobalApplication.GetMessageShower().ShowDefaultMessage();

            if (response == null)
            {
                GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage("Response is null", ShowMessageType.Long);
                return;
            }
            if (!response.Success)
            {
                GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(response.Message, ShowMessageType.Permanent);
                return;
            }
            advertisementTransportation = response.ResponseData;
            fillImageSection();
            fillDataSection();
        }
        private void fillImageSection()
        {
            if (advertisementTransportation == null || advertisementTransportation.AdvertisementCommon == null || advertisementTransportation.AdvertisementCommon.AdvertisementImages == null)
                return;
            for (int i = 1; i < advertisementTransportation.AdvertisementCommon.AdvertisementImages.Length; i += 2)// just show big images
            {
                var imageView = new ImageView(this);
                setBitmapImage(imageView, advertisementTransportation.AdvertisementCommon.AdvertisementImages[i]);
                LinearLayout.LayoutParams layoutParams =
                    new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.WrapContent);


                layoutParams.SetMargins(10, 10, 10, 10);
                linearLayoutImageContainer.AddView(imageView, layoutParams);
            }
        }

        private void fillDataSection()
        {
            fillAdTitle();
            fillBrand();
        }

        private void fillAdTitle()
        {
            TextView textViewAdTitle = FindViewById<TextView>(Resource.Id.textViewAdTitle);
            textViewAdTitle.Text = advertisementTransportation.AdvertisementCommon.AdvertisementTitle;
        }

        private void fillBrand()
        {
            TextView textViewBrand = FindViewById<TextView>(Resource.Id.textViewBrand);
            textViewBrand.Text = advertisementTransportation.BrandName;
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