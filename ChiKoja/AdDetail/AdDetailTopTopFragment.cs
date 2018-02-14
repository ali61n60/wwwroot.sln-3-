using System;
using Android.OS;
using Android.Support.V4.App;
using Android.Views;
using Android.Widget;
using ChiKoja.Repository.UserMarkedAds;
using CustomViews.MarkAd;
using ModelStd.Db.Ad;

namespace ChiKoja.AdDetail
{
    public class AdDetailTopTopFragment:Fragment
    {
        private MarkAdView markAdView;
        private Button buttonShare;
        private Button buttonBack;
        UserMarkedAds userMarkedAds;
        Guid adGuid;

        View rootView;
        public AdDetailTopTopFragment() { }

        public override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            if (!Arguments.ContainsKey(Advertisement.AdGuidKey))
            {
                //TODO make error handling better
                Toast.MakeText(this.Activity, "IntentmustContain AdGuidKey and Value", ToastLength.Long).Show();
                return;
            }
            adGuid = Guid.Parse(Arguments.GetString(Advertisement.AdGuidKey));

        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_toptop, container, false);
            return rootView;
        }
        public override async void OnResume()
        {
            base.OnResume();

            initializeFields();
            initializeEvents();
        }

        private void initializeFields()
        {
            //TODO inject it
            userMarkedAds = new UserMarkedAds(Repository.Repository.DataBasePath);
            markAdView = rootView.FindViewById<MarkAdView>(Resource.Id.markAdView);
            buttonShare = rootView.FindViewById<Button>(Resource.Id.buttonShare);
            buttonBack = rootView.FindViewById<Button>(Resource.Id.buttonBack);
            manageButtonMarkAdText();
        }

        private void initializeEvents()
        {
            markAdView.Click += markAdView_Click;
            buttonBack.Click += ButtonBack_Click;
        }

        private void ButtonBack_Click(object sender, EventArgs e)
        {
            Activity.Finish();
        }

        void markAdView_Click(object sender, EventArgs e)
        {
            if (userMarkedAds.IsAdMarked(Repository.Repository.Locker, adGuid))
            {
                userMarkedAds.UnmarAd(Repository.Repository.Locker, adGuid);
                Toast.MakeText(Activity,"Ad Unmarked",ToastLength.Long).Show();
            }
            else
            {
                userMarkedAds.MarkAd(Repository.Repository.Locker, adGuid);
                Toast.MakeText(Activity, "Ad Marked", ToastLength.Long).Show();
            }
                
            manageButtonMarkAdText();
        }

        private void manageButtonMarkAdText()
        {
                markAdView.SetMark(userMarkedAds.IsAdMarked(Repository.Repository.Locker, adGuid));
        }

    }
}