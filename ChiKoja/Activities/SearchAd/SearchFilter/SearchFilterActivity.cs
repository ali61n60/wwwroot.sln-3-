using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Android.Text;
using Android.Widget;
using ChiKoja.Categories;
using ChiKoja.Models;
using ChiKoja.Repository.Filter;


namespace ChiKoja.SearchAd.SearchFilter
{
    //this class gets user input filters and stores them in preference storage via commonfilter class and ...
    [Activity(Label = "ActivitySearchFilter", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class SearchFilterActivity : AppCompatActivity
    {
        //TODO store initial values into class variables and check new value against that
        //TODO format edittext to show numbers 12,123

        private CategorySelection _categorySelection;


        CommonFilter commonFilter;
       // View rootView;
        AppCompatButton buttonReturn;
       
        private bool filterParameterChangedByUser = false;

        //top_top
        //buttonCategory
        //buttonSort
        //category_specific_part

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            initializeFields();
            
        }
        private void inflateView()
        {
            SetContentView(Resource.Layout.filter);
        }
        private void initializeFields()
        {
            commonFilter = new CommonFilter();
            buttonReturn = FindViewById<AppCompatButton>(Resource.Id.buttonReturn);
            buttonReturn.Click += buttonReturn_Click;
            

            _categorySelection.SelectedCategoryCahnged += (sender, args) =>
            {

            };
        }

        

        

        void buttonReturn_Click(object sender, EventArgs e)
        {
            if (filterParameterChangedByUser)
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
            Intent data = new Intent();
            data.PutExtra("SearchFilterChanged", filterParameterChangedByUser);
            SetResult(Result.Ok, data);
            Finish();
        }

        void buttonCategory_Click(object sender, EventArgs e)
        {
            Intent categorySelectionIntent = new Intent(this, typeof(ActivityCategory));

            categorySelectionIntent.PutExtra("CategorySelection", _categorySelection);
            StartActivityForResult(categorySelectionIntent, SearchAdActivity.CategorySelectionRequestCode);
        }

        private void buttonSortBy_Click(object sender, EventArgs eventArgs)
        {
            Intent orderByIntent = new Intent(this, typeof(ActivitySortBy));
            StartActivityForResult(orderByIntent, NavigationDrawer.NavActivity.OrderByRequestCode);
        }

    }
}