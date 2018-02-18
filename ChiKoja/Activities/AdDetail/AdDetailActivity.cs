using System;
using System.Linq;
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
    public class AdDetailActivity : NavActivity
    {
        //TODO show similar ads
        AdvertisementCommon advertisementCommon;
        string adGuid;
        private int categoryId;
        private bool serverAlreadyCalled = false;

        private AdDetailTopTopFragment adDetailTopTopFragment;
        private AdDetailImageFragment adDetailImageFragment;
        private AdDetailCommonPartFragment adDetailCommonPartFragment;
        private CategorySpecificBaseFragment categorySpecificFragment;
        private AdDetailWarningFragment _adDetailWarningFragment;
        private AdDetailSimilarAdsFragment _adDetailSimilarAdsFragment;
        private AdDetailContactOwnerFragment _adDetailContactOwnerFragment;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            addFragments();
        }

        protected override async void OnResume()
        {
            base.OnResume();
            if (!serverAlreadyCalled)
            {
                advertisementCommon = await getAdDetailFromServer();
                serverAlreadyCalled = true;
            }
            
            adDetailImageFragment.SetImages(advertisementCommon.AdImages.ToList());
            adDetailCommonPartFragment.SetAdvertisementCommon(advertisementCommon);
            categorySpecificFragment.SetAdDetailData(advertisementCommon);
            //warning data
            //similar ad data

            _adDetailContactOwnerFragment.SetPhoneNumber(advertisementCommon.PhoneNumber);

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
            categoryId = Intent.GetIntExtra(Category.CategoryIdKey, Category.CategoryIdDefault);

            FrameLayout contentFrameLayout =
                FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            LayoutInflater.Inflate(Resource.Layout.ad_detail_act, contentFrameLayout);

        }

        private void addFragments()
        {
            addTopTop();
            addImage();
            addCommonPart();
            addCategorySpecificPart();
            addWarning();
            addSimilarAds();
            addContactOwner();
        }


        private void addTopTop()
        {
            adDetailTopTopFragment = new AdDetailTopTopFragment();
            Bundle args = new Bundle();
            args.PutString(Advertisement.AdGuidKey, adGuid);
            adDetailTopTopFragment.Arguments = args;
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.top_top, adDetailTopTopFragment)
                .Commit();
        }

        private void addImage()
        {
            adDetailImageFragment = new AdDetailImageFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.image, adDetailImageFragment)
                .Commit();
        }

        private void addCommonPart()
        {
            adDetailCommonPartFragment = new AdDetailCommonPartFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.common_part, adDetailCommonPartFragment)
                .Commit();
        }

        private void addCategorySpecificPart()
        {
            
            categorySpecificFragment = AdViewContainer.GetCategorySpecificAdDetailViewFragment(categoryId);
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.category_specific_part, categorySpecificFragment)
                .Commit();
        }

        private void addWarning()
        {
            _adDetailWarningFragment =new AdDetailWarningFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.warning, _adDetailWarningFragment)
                .Commit();
        }

        private void addSimilarAds()
        {
            _adDetailSimilarAdsFragment=new AdDetailSimilarAdsFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.similar_ads, _adDetailSimilarAdsFragment)
                .Commit();
        }


        private void addContactOwner()
        {
            _adDetailContactOwnerFragment = new AdDetailContactOwnerFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.contact_owner, _adDetailContactOwnerFragment)
                .Commit();
        }


    }
}