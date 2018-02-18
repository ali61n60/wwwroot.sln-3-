using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Widget;
using ChiKoja.Categories;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Models;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository.Filter;


namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    //this class gets user input filters and stores them in preference storage via commonfilter class and ...
    [Activity(Label = "ActivitySearchFilter", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class SearchFilterActivity : NavActivity
    {
        //TODO store initial values into class variables and check new value against that
        //TODO format edittext to show numbers 12,123

        private SearchFilterTopTopFragment searchFilterTopTop;
        private SearchFilterCategorySpecificBaseCriteria searchFilterCategorySpecificCriteria;
        private AppCompatButton buttonCategory;
        private AppCompatButton buttonSort;
        


        //category_specific_part
        private CategorySelection _categorySelection;


        CommonFilter commonFilter;
      
        private bool filterParameterChangedByUser = false;

        

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            initializeFields();
            initializeEvents();
            addFragments();
        }
        private void inflateView()
        {
            FrameLayout contentFrameLayout =
                FindViewById<FrameLayout>(Resource.Id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml
            LayoutInflater.Inflate(Resource.Layout.search_filter_act, contentFrameLayout);
        }
        private void initializeFields()
        {
            commonFilter = new CommonFilter();
            buttonCategory = FindViewById<AppCompatButton>(Resource.Id.buttonCategory);
            buttonSort = FindViewById<AppCompatButton>(Resource.Id.buttonSort);


            //_categorySelection.SelectedCategoryCahnged += (sender, args) =>
            //{

            //};
        }

        private void addFragments()
        {
            addTopTop();
            addCategorySpecific(); 
        }

        private void initializeEvents()
        {
            buttonCategory.Click += buttonCategory_Click;
            buttonSort.Click += buttonSortBy_Click;
        }

        private void addTopTop()
        {
            searchFilterTopTop=new SearchFilterTopTopFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.top_top, searchFilterTopTop)
                .Commit();
        }

        private void addCategorySpecific()
        {
            //TODO get user selected category from somewhere
            int categoryId = 0;
            searchFilterCategorySpecificCriteria= AdViewContainer.GetCategorySpecificSearchFilterViewFragment(categoryId);
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.category_specific_part, searchFilterCategorySpecificCriteria)
                .Commit();
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