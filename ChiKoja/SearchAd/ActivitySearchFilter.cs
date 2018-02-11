using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Text;
using Android.Widget;
using ChiKoja.Repository.Filter;


namespace ChiKoja.SearchAd
{
    //this class gets user input filters and stores them in preference storage via commonfilter class and ...
    [Activity(Label = "ActivitySearchFilter", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class ActivitySearchFilter : AppCompatActivity
    {
        //TODO store initial values into class variables and check new value against that
        //TODO format edittext to show numbers 12,123
            
        CommonFilter commonFilter;
       // View rootView;
        Button buttonReturn;
        EditText editTextMinimumPrice;
        EditText editTextMaximumPrice;
        CheckBox checkBoxOnlyWithPictures;
        CheckBox checkBoxUrgentAdsOnly;
        private bool filterParameterChangedByUser = false;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            initializeFields();
            updateFieldsFromSavedPreferences();
        }
        private void inflateView()
        {
            SetContentView(Resource.Layout.filter);
        }
        private void initializeFields()
        {
            commonFilter = new CommonFilter();
            buttonReturn = FindViewById<Button>(Resource.Id.buttonReturn);
            buttonReturn.Click += buttonReturn_Click;
            editTextMinimumPrice = FindViewById<EditText>(Resource.Id.editTextMinimumPrice);
            editTextMinimumPrice.TextChanged += editTextsPrice_TextChanged;
            editTextMaximumPrice = FindViewById<EditText>(Resource.Id.editTextMaximumPrice);
            editTextMaximumPrice.TextChanged += editTextsPrice_TextChanged;
            checkBoxOnlyWithPictures = FindViewById<CheckBox>(Resource.Id.checkBoxOnlyWithPictures);
            checkBoxOnlyWithPictures.CheckedChange += checkBoxOnlyWithPictures_CheckedChange;
            checkBoxUrgentAdsOnly = FindViewById<CheckBox>(Resource.Id.checkBoxUrgentAdsOnly);
            checkBoxUrgentAdsOnly.CheckedChange += checkBoxUrgentAdsOnly_CheckedChange;
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
            filterParameterChangedByUser = true;
        }

        private void updateFieldsFromSavedPreferences()
        {
            editTextMinimumPrice.Text = commonFilter.MinimumPrice.ToString("N0");
            editTextMaximumPrice.Text = commonFilter.MaximumPrice.ToString("N0");
            checkBoxOnlyWithPictures.Checked = commonFilter.OnlyWithPictures;
            checkBoxUrgentAdsOnly.Checked = commonFilter.UrgentAdsOnly;
        }

        void buttonReturn_Click(object sender, EventArgs e)
        {
            if (filterParameterChangedByUser)
            {
                try
                {
                    commonFilter.MinimumPrice = float.Parse(editTextMinimumPrice.Text);
                    commonFilter.MaximumPrice = float.Parse(editTextMaximumPrice.Text);
                    commonFilter.OnlyWithPictures = checkBoxOnlyWithPictures.Checked;
                    commonFilter.UrgentAdsOnly = checkBoxUrgentAdsOnly.Checked;
                }
                catch (Exception ex)
                {

                }
            }
            Intent data = new Intent();
            data.PutExtra("SearchFilterChanged", filterParameterChangedByUser);
            SetResult(Result.Ok, data);
            Finish();
        }

    }
}