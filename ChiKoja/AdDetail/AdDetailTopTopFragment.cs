using System;
using Android.OS;
using Android.Support.V4.App;
using Android.Views;
using Android.Widget;
using ChiKoja.Repository.UserMarkedAds;
using ModelStd.Db.Ad;

namespace ChiKoja.AdDetail
{
    public class AdDetailTopTopFragment:Fragment
    {
        //TODO make the view nicer and add functionallity

        private Button buttonMarkAd;
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
            buttonMarkAd = rootView.FindViewById<Button>(Resource.Id.buttonMarkAd);
            manageButtonMarkAdText();
        }

        private void initializeEvents()
        {
            buttonMarkAd.Click += buttonMarkAd_Click;
        }

        void buttonMarkAd_Click(object sender, EventArgs e)
        {
            if (userMarkedAds.IsAdMarked(Repository.Repository.Locker, adGuid))
                userMarkedAds.UnmarAd(Repository.Repository.Locker, adGuid);
            else
                userMarkedAds.MarkAd(Repository.Repository.Locker, adGuid);
            manageButtonMarkAdText();
        }

        private void manageButtonMarkAdText()
        {
            if (userMarkedAds.IsAdMarked(Repository.Repository.Locker, adGuid))
                buttonMarkAd.Text = Resources.GetString(Resource.String.UnMarkAd);
            else
                buttonMarkAd.Text = Resources.GetString(Resource.String.MarkAd);
        }

    }
}