using System;
using System.Threading.Tasks;
using Android.App;
using Android.OS;
using Android.Widget;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.NavigationDrawer;
using ChiKoja.Notification;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.AdDetail
{
    [Activity(Label = "AdDetailActivity", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class AdDetailActivity:NavActivity
    {
        //TODO show similar ads
        AdvertisementCommon advertisementCommon;
        string adGuid;
        private int categoryId;

        private AdDetailTopTopFragment adDetailTopTopFragment;
        private AdDetailContactOwner adDetailContactOwner;
        private CategorySpecificBaseFragment categorySpecificFragment;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            addFragments();
        }

        protected override async void OnResume()
        {
            base.OnResume();
            advertisementCommon = await getAdDetailFromServer();
            //give info from server to fragments to use
            adDetailContactOwner.SetPhoneNumber(advertisementCommon.PhoneNumber);
            categorySpecificFragment.SetAdDetailData(advertisementCommon);
        }
        private async Task<AdvertisementTransportation> getAdDetailFromServer()
        {
            AdvertisementTransportation advertisementTransportation = null;
            IAdApi adApi = Bootstrapper.container.GetInstance<IAdApi>();
            GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(Resources.GetString(Resource.String.ServerCall), ShowMessageType.Permanent);
            ResponseBase<AdvertisementCommon> response = await adApi.GetAdDetail(new AdDetailInfo()
            {
                AdGuid = adGuid,
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
                    Toast.MakeText(this, ex.Message, ToastLength.Long).Show();
                }
            }

            else
            {
                GlobalApplication.GlobalApplication.GetMessageShower().ShowMessage(response.Message, ShowMessageType.Permanent);
            }

            return advertisementTransportation;
        }

        private void inflateView()
        {
            //TODO make error handling better
            if (!Intent.HasExtra(Advertisement.AdGuidKey))
            {
                Toast.MakeText(this, "Intent must conatin AdGuidKey and Value", ToastLength.Long).Show();
                return;
            }
            if (!Intent.HasExtra(Category.CategoryIdKey))
            {
                Toast.MakeText(this, "IntentmustContain CategoryIdKey and Value", ToastLength.Long).Show();
                return;
            }
            adGuid = Intent.GetStringExtra(Advertisement.AdGuidKey);
            categoryId = Intent.GetIntExtra(Category.CategoryIdKey,Category.CategoryIdDefault);

            FrameLayout contentFrameLayout =
                FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            LayoutInflater.Inflate(Resource.Layout.ad_detail, contentFrameLayout);
            
        }

        private void addFragments()
        {
            addTopTop();
            addMain();
            addContactOwner();
        }

        
        private void addTopTop()
        {
            adDetailTopTopFragment = new AdDetailTopTopFragment();
            Bundle args=new Bundle();
            args.PutString(Advertisement.AdGuidKey,adGuid);
            adDetailTopTopFragment.Arguments = args;
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.top_top, adDetailTopTopFragment)
                .Commit();
        }

        private void addMain()
        {
            categorySpecificFragment = AdViewContainer.GetAdDetailViewFragment(categoryId);
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.main, categorySpecificFragment)
                .Commit();
        }
        private void addContactOwner()
        {
            adDetailContactOwner = new AdDetailContactOwner();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.contact_owner, adDetailContactOwner)
                .Commit();
        }


    }
}