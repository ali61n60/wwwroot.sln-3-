

using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using ChiKoja.Infrastructure;
using ModelStd.Advertisements.Price;

namespace ChiKoja.Activities.SearchAd.SearchFilter.Price
{
    class SearchFilterPriceDefaultFragment: SearchFilterBaseCriteria
    {
        private Context _context;
        View _rootView;

        AppCompatEditText _editTextMinimumPrice;
        AppCompatEditText _editTextMaximumPrice;

        public SearchFilterPriceDefaultFragment() { }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            _rootView = inflater.Inflate(Resource.Layout.search_filter_price_default_frag, container, false);

            initializeFields();
            initializeEvents();
            updateFieldsFromSavedPreferences();

            return _rootView;
        }

        private void initializeFields()
        {
            _editTextMinimumPrice = _rootView.FindViewById<AppCompatEditText>(Resource.Id.editTextMinimumPrice);
            _editTextMaximumPrice = _rootView.FindViewById<AppCompatEditText>(Resource.Id.editTextMaximumPrice);
        }
        private void initializeEvents()
        {

        }

        private void updateFieldsFromSavedPreferences()
        {
            _editTextMinimumPrice.Text = AppPreferences.GetSearchPref(FixedPrice.MinPriceKey, FixedPrice.MinPriceDefault.ToString());
            _editTextMaximumPrice.Text = AppPreferences.GetSearchPref(FixedPrice.MaxPriceKey, FixedPrice.MaxPriceDefault.ToString());
        }

        public override void PersistUserFilter()
        {
            AppPreferences.SetSearchPref(FixedPrice.MinPriceKey, _editTextMinimumPrice.Text);
            AppPreferences.SetSearchPref(FixedPrice.MaxPriceKey, _editTextMaximumPrice.Text);
        }

        public override void FillUserInputSearchFilter(Dictionary<string, string> userInputDictionary)
        {
            userInputDictionary[FixedPrice.MinPriceKey] = AppPreferences.GetSearchPref(FixedPrice.MinPriceKey, FixedPrice.MinPriceDefault.ToString());
            userInputDictionary[FixedPrice.MaxPriceKey] = AppPreferences.GetSearchPref(FixedPrice.MaxPriceKey, FixedPrice.MaxPriceDefault.ToString());
        }

        public override void ClearPreferences()
        {
            throw new System.NotImplementedException();
        }
    }
}