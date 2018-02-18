using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Text;
using Android.Views;
using Android.Widget;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchCriteriaDefault : Fragment
    {
        private Context _context;
        View rootView;

        AppCompatEditText editTextMinimumPrice;
        AppCompatEditText editTextMaximumPrice;
        AppCompatCheckBox checkBoxOnlyWithPictures;
        AppCompatCheckBox checkBoxUrgentAdsOnly;

        public SearchCriteriaDefault()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.search_filter_criteria_default_frag, container, false);

            initializeFields();
            initializeEvents();
            updateFieldsFromSavedPreferences();

            return rootView;
        }

        private void initializeFields()
        {
            editTextMinimumPrice = rootView.FindViewById<AppCompatEditText>(Resource.Id.editTextMinimumPrice);
            editTextMinimumPrice.TextChanged += editTextsPrice_TextChanged;
            editTextMaximumPrice = rootView.FindViewById<AppCompatEditText>(Resource.Id.editTextMaximumPrice);
            editTextMaximumPrice.TextChanged += editTextsPrice_TextChanged;
            checkBoxOnlyWithPictures = rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxOnlyWithPictures);
            checkBoxOnlyWithPictures.CheckedChange += checkBoxOnlyWithPictures_CheckedChange;
            checkBoxUrgentAdsOnly = rootView.FindViewById<AppCompatCheckBox>(Resource.Id.checkBoxUrgentAdsOnly);
            checkBoxUrgentAdsOnly.CheckedChange += checkBoxUrgentAdsOnly_CheckedChange;
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