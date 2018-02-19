using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Text;
using Android.Views;
using Android.Widget;

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
            _editTextMinimumPrice.TextChanged += editTextsPrice_TextChanged;
            _editTextMaximumPrice = _rootView.FindViewById<AppCompatEditText>(Resource.Id.editTextMaximumPrice);
            _editTextMaximumPrice.TextChanged += editTextsPrice_TextChanged;
            _checkBoxOnlyWithPictures = _rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxOnlyWithPictures);
            _checkBoxOnlyWithPictures.CheckedChange += checkBoxOnlyWithPictures_CheckedChange;
            _checkBoxUrgentAdsOnly = _rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxUrgentAdsOnly);
            _checkBoxUrgentAdsOnly.CheckedChange += checkBoxUrgentAdsOnly_CheckedChange;
        }

        private void initializeEvents()
        {

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
           // filterParameterChangedByUser = true;
        }

        private void updateFieldsFromSavedPreferences()
        {
            //editTextMinimumPrice.Text = commonFilter.MinimumPrice.ToString("N0");
            //editTextMaximumPrice.Text = commonFilter.MaximumPrice.ToString("N0");
            //checkBoxOnlyWithPictures.Checked = commonFilter.OnlyWithPictures;
            //checkBoxUrgentAdsOnly.Checked = commonFilter.UrgentAdsOnly;
        }

    }
}