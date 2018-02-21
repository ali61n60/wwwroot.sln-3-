using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Text;
using Android.Views;
using Android.Widget;
using ChiKoja.Infrastructure;
using ModelStd.Advertisements.Price;
using ModelStd.Db.Ad;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchFilterCriteriaDefaultFragment : SearchFilterCategorySpecificBaseCriteria
    {      
        private Context _context;
        View _rootView;

        AppCompatEditText _editTextMinimumPrice;
        AppCompatEditText _editTextMaximumPrice;
        AppCompatCheckBox _checkBoxOnlyWithPictures;
        AppCompatCheckBox _checkBoxUrgentAdsOnly;

        private RadioButton _radioButtonAdTypeAll;
        private RadioButton _radioButtonAdTypeOffer;
        private RadioButton _radioButtonAdTypeDemand;

        private bool _filterParameterChangedByUser;

        public SearchFilterCriteriaDefaultFragment()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            _rootView = inflater.Inflate(Resource.Layout.search_filter_criteria_default_frag, container, false);

            initializeFields();
            initializeEvents();
            updateFieldsFromSavedPreferences();

            return _rootView;
        }

        
        private void initializeFields()
        {
            _editTextMinimumPrice = _rootView.FindViewById<AppCompatEditText>(Resource.Id.editTextMinimumPrice);
            _editTextMaximumPrice = _rootView.FindViewById<AppCompatEditText>(Resource.Id.editTextMaximumPrice);
            _checkBoxOnlyWithPictures = _rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxOnlyWithPictures);
            _checkBoxUrgentAdsOnly = _rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxUrgentAdsOnly);

            _radioButtonAdTypeAll = _rootView.FindViewById<RadioButton>(Resource.Id.radioButtonAll);
            _radioButtonAdTypeOffer = _rootView.FindViewById<RadioButton>(Resource.Id.radioButtonOffer);
            _radioButtonAdTypeDemand = _rootView.FindViewById<RadioButton>(Resource.Id.radioButtonDemand);
        }

        private void initializeEvents()
        {
            _editTextMinimumPrice.TextChanged += editTextsPrice_TextChanged;
            _editTextMaximumPrice.TextChanged += editTextsPrice_TextChanged;
            _checkBoxOnlyWithPictures.CheckedChange += checkBoxOnlyWithPictures_CheckedChange;
            _checkBoxUrgentAdsOnly.CheckedChange += checkBoxUrgentAdsOnly_CheckedChange;
        }

        void checkBoxUrgentAdsOnly_CheckedChange(object sender, CompoundButton.CheckedChangeEventArgs e)
        {
            filterParametersChangedByUser();
        }

        void checkBoxOnlyWithPictures_CheckedChange(object sender, CompoundButton.CheckedChangeEventArgs e)
        {
            filterParametersChangedByUser();
        }
        private void editTextsPrice_TextChanged(object sender, TextChangedEventArgs e)
        {
            filterParametersChangedByUser();
        }

        private void filterParametersChangedByUser()
        {
            _filterParameterChangedByUser = true;
        }

        private void updateFieldsFromSavedPreferences()
        {
            _editTextMinimumPrice.Text =AppPreferences.GetSearchPref(FixedPrice.MinPriceKey,FixedPrice.MinPriceDefault.ToString());
            _editTextMaximumPrice.Text = AppPreferences.GetSearchPref(FixedPrice.MaxPriceKey, FixedPrice.MaxPriceDefault.ToString());
            _checkBoxOnlyWithPictures.Checked =bool.Parse(AppPreferences.GetSearchPref(Advertisement.OnlyWithPicturesKey, Advertisement.OnlyWithPicturesDefault.ToString()));
            _checkBoxUrgentAdsOnly.Checked = bool.Parse(AppPreferences.GetSearchPref(Advertisement.UrgentAdsOnlyKey, Advertisement.UrgentAdsOnlyDefault.ToString()));
        }

        public override void PersistUserFilter()
        {
            persistAdType();
           
            if (_filterParameterChangedByUser)
            {
                try
                {
                    //commonFilter.MinimumPrice = float.Parse(editTextMinimumPrice.Text);
                    //commonFilter.MaximumPrice = float.Parse(editTextMaximumPrice.Text);
                    //commonFilter.OnlyWithPictures = checkBoxOnlyWithPictures.Checked;
                    //commonFilter.UrgentAdsOnly = checkBoxUrgentAdsOnly.Checked;
                }
                catch (Exception ex)
                {

                }
            }
        }

        private void persistAdType()
        {
            if (_radioButtonAdTypeOffer.Checked)
            {
                AppPreferences.SetSearchPref(Advertisement.AdTypeKey,((int)AdType.Offer).ToString());
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

        public override void FillCategorySpecificUserInputSearchFilter(Dictionary<string, string> userInputDictionary)
        {
            //TODO Add OrderBy from its fragment
            //userInputDictionary[OrderByKey]=pref.GetInt(OrderByKey)
            //TODO Add PriceType from its fragment
            //MinPrice
            //MAxPrice
           
            userInputDictionary[Advertisement.AdTypeKey] = AppPreferences.GetSearchPref(Advertisement.AdTypeKey, Advertisement.AdTypeDefault.ToString());
        }

        public override void ClearPreferences()
        {
            throw new NotImplementedException();
        }
    }
}