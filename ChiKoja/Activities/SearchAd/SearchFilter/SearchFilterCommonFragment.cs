using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.Infrastructure;
using ModelStd.Db.Ad;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchFilterCommonFragment: SearchFilterBaseCriteria
    {
        private Context _context;
        View _rootView;

        AppCompatCheckBox _checkBoxOnlyWithPictures;
        AppCompatCheckBox _checkBoxUrgentAdsOnly;

        private RadioButton _radioButtonAdTypeAll;
        private RadioButton _radioButtonAdTypeOffer;
        private RadioButton _radioButtonAdTypeDemand;

        public SearchFilterCommonFragment()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            _rootView = inflater.Inflate(Resource.Layout.search_filter_common_frag, container, false);

            initializeFields();
            initializeEvents();
            updateFieldsFromSavedPreferences();

            return _rootView;
        }

        private void initializeFields()
        {
            _checkBoxOnlyWithPictures = _rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxOnlyWithPictures);
            _checkBoxUrgentAdsOnly = _rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxUrgentAdsOnly);

            _radioButtonAdTypeAll = _rootView.FindViewById<RadioButton>(Resource.Id.radioButtonAll);
            _radioButtonAdTypeOffer = _rootView.FindViewById<RadioButton>(Resource.Id.radioButtonOffer);
            _radioButtonAdTypeDemand = _rootView.FindViewById<RadioButton>(Resource.Id.radioButtonDemand);
        }

        private void initializeEvents()
        {

        }

        private void updateFieldsFromSavedPreferences()
        {
            _checkBoxOnlyWithPictures.Checked = bool.Parse(AppPreferences.GetSearchPref(Advertisement.OnlyWithPicturesKey, Advertisement.OnlyWithPicturesDefault.ToString()));
            _checkBoxUrgentAdsOnly.Checked = bool.Parse(AppPreferences.GetSearchPref(Advertisement.UrgentAdsOnlyKey, Advertisement.UrgentAdsOnlyDefault.ToString()));

            updateAdType();
        }

        private void updateAdType()
        {
            AdType savedAdType = (AdType)Enum.Parse(typeof(AdType), AppPreferences.GetSearchPref(Advertisement.AdTypeKey, Advertisement.AdTypeDefault.ToString()));
            switch (savedAdType)
            {
                case AdType.All:
                    _radioButtonAdTypeAll.Checked = true;
                    break;
                case AdType.Offer:
                    _radioButtonAdTypeOffer.Checked = true;
                    break;
                case AdType.Demand:
                    _radioButtonAdTypeDemand.Checked = true;
                    break;
                default:
                    _radioButtonAdTypeAll.Checked = true;
                    break;
            }
        }



        public override void PersistUserFilter()
        {
            AppPreferences.SetSearchPref(Advertisement.OnlyWithPicturesKey, _checkBoxOnlyWithPictures.Checked.ToString());
            AppPreferences.SetSearchPref(Advertisement.UrgentAdsOnlyKey, _checkBoxUrgentAdsOnly.Checked.ToString());

            persistAdType();
        }

        private void persistAdType()
        {
            if (_radioButtonAdTypeOffer.Checked)
            {
                AppPreferences.SetSearchPref(Advertisement.AdTypeKey, ((int)AdType.Offer).ToString());
            }
            else if (_radioButtonAdTypeDemand.Checked)
            {
                AppPreferences.SetSearchPref(Advertisement.AdTypeKey, ((int)AdType.Demand).ToString());
            }
            else
            {
                AppPreferences.SetSearchPref(Advertisement.AdTypeKey, ((int)AdType.All).ToString());
            }
        }

        public override void FillUserInputSearchFilter(Dictionary<string, string> userInputDictionary)
        {
            userInputDictionary[Advertisement.AdTypeKey] = AppPreferences.GetSearchPref(Advertisement.AdTypeKey, Advertisement.AdTypeDefault.ToString());
        }

        public override void ClearPreferences()
        {
            throw new NotImplementedException();
        }
    }
}