using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Widget;
using ChiKoja.Activities.Categories;
using ChiKoja.Infrastructure;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.Models;
using ChiKoja.NavigationDrawer;
using ModelStd.Db.Ad;


namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    //TODO Add OrderBy from its fragment
    //userInputDictionary[OrderByKey]=pref.GetInt(OrderByKey)
    //TODO Add PriceType from its fragment


    //this class gets user input filters and stores them in preference storage via commonfilter class and ...
    [Activity(Label = "ActivitySearchFilter", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class SearchFilterActivity : NavActivity,ISetSearchFilter
    {
        //TODO format edittext to show numbers 12,123

        private SearchFilterTopTopFragment _searchFilterTopTop;
        private SearchFilterCommonFragment _searchFilterCommon;
        private SearchFilterBaseCriteria _searchFilterPrice;
        private SearchFilterBaseCriteria _searchFilterCriteria;
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
            addCommon();
            addPrice();
            addCategorySpecific(); 
        }

        private void initializeEvents()
        {
            _buttonCategory.Click += buttonCategory_Click;
            _buttonSort.Click += buttonSortBy_Click;
        }

        private void addTopTop()
        {
            _searchFilterTopTop= new SearchFilterTopTopFragment();
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.top_top, _searchFilterTopTop)
                .Commit();
        }

        private void addCommon()
        {
            _searchFilterCommon = AdViewContainer.GetSearchFilterCommon();
                
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.common_part, _searchFilterCommon)
                .Commit();
        }

        private void addPrice()
        {
            int categoryId = int.Parse(AppPreferences.GetSearchPref(Category.CategoryIdKey, Category.CategoryIdDefault.ToString()));
            _searchFilterPrice = AdViewContainer.GetSearchFilterPrice(categoryId);
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.price_part, _searchFilterPrice)
                .Commit();
        }

        private void addCategorySpecific()
        {
            int categoryId =int.Parse(AppPreferences.GetSearchPref(Category.CategoryIdKey, Category.CategoryIdDefault.ToString()));

            _searchFilterCriteria= AdViewContainer.GetCategorySpecificSearchFilterViewFragment(categoryId);
            SupportFragmentManager.BeginTransaction()
                .Add(Resource.Id.category_specific_part, _searchFilterCriteria)
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
            StartActivityForResult(orderByIntent, OrderByRequestCode);
        }

        public void SetSearchFilter()
        {
            //this method is called from SearchFilterTopTopFragment to tell the activity that user has clicked ok button
            _searchFilterPrice.PersistUserFilter();
            _searchFilterCriteria.PersistUserFilter();
            SetResult(Result.Ok);
            Finish();
        }
    }
}