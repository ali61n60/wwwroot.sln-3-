using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Widget;
using ChiKoja.Activities.Categories;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Models;
using ChiKoja.NavigationDrawer;


namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    //this class gets user input filters and stores them in preference storage via commonfilter class and ...
    [Activity(Label = "ActivitySearchFilter", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class SearchFilterActivity : NavActivity,ISetSearchFilter
    {
        //TODO format edittext to show numbers 12,123

        private SearchFilterTopTopFragment _searchFilterTopTop;
        private SearchFilterCategorySpecificBaseCriteria _searchFilterCategorySpecificCriteria;
        private AppCompatButton _buttonCategory;
        private AppCompatButton _buttonSort;
        
        //category_specific_part
        private CategorySelection _categorySelection;
        
        
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
            _buttonCategory = FindViewById<AppCompatButton>(Resource.Id.buttonCategory);
            _buttonSort = FindViewById<AppCompatButton>(Resource.Id.buttonSort);


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
            _buttonCategory.Click += buttonCategory_Click;
            _buttonSort.Click += buttonSortBy_Click;
        }

        private void addTopTop()
        {
            _searchFilterTopTop=new SearchFilterTopTopFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.top_top, _searchFilterTopTop)
                .Commit();
        }

        private void addCategorySpecific()
        {
            //TODO get user selected category from somewhere
            int categoryId = 0;

            _searchFilterCategorySpecificCriteria= AdViewContainer.GetCategorySpecificSearchFilterViewFragment(categoryId);
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.category_specific_part, _searchFilterCategorySpecificCriteria)
                .Commit();
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

        public void SetSearchFilter()
        {
            //this method is called from SearchFilterTopTopFragment to tell the activity that user has clicked ok button
            _searchFilterCategorySpecificCriteria.PersistUserFilter();
            SetResult(Result.Ok);
            Finish();
        }
    }
}