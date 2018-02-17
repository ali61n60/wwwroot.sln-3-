using System;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Support.V4.App;
using Android.Views;
using ChiKoja.Categories;
using ChiKoja.Interfaces.SingleAd;
using ChiKoja.Models;

namespace ChiKoja.SearchAd
{
    class SearchFilter : Fragment
    {
        private ISingleAdEvents _singleAdEvents;
        private Context _context;
        View rootView;
        AppCompatButton buttonFilter;
        AppCompatButton buttonSort;
        AppCompatButton buttonCategory;

        private CategorySelection _categorySelection;

        public SearchFilter()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.serarch_filter, container, false);

            initializeFields();
            initializeEvents();

            return rootView;
        }

        public override void OnAttach(Context context)
        {
            base.OnAttach(context);
            _context = context;
            if (context is ISingleAdEvents)
            {
                _singleAdEvents = context as ISingleAdEvents;
            }
            else
            {
                throw new Exception("context must implement SingleAdEvents Interface");
            }
        }

        private void initializeFields()
        {
            buttonFilter = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonFilter);
            buttonSort = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSort);
            buttonCategory = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonCategory);

            _categorySelection = new CategorySelection();
        }

        private void initializeEvents()
        {
            buttonFilter.Click += buttonFilter_Click;

            buttonSort.Click += buttonSortBy_Click;

            buttonCategory.Click += buttonCategory_Click;

            _categorySelection.SelectedCategoryCahnged += (sender, args) =>
            {

            };
        }

        void buttonCategory_Click(object sender, EventArgs e)
        {
            Intent categorySelectionIntent = new Intent(_context, typeof(ActivityCategory));

            categorySelectionIntent.PutExtra("CategorySelection", _categorySelection);
            StartActivityForResult(categorySelectionIntent, SearchAdActivity.CategorySelectionRequestCode);
        }

        private void buttonSortBy_Click(object sender, EventArgs eventArgs)
        {
            Intent orderByIntent = new Intent(_context, typeof(ActivitySortBy));
            StartActivityForResult(orderByIntent, NavigationDrawer.NavActivity.OrderByRequestCode);
        }

        void buttonFilter_Click(object sender, EventArgs e)
        {
            Intent searchFilterIntent = new Intent(_context, typeof(ActivitySearchFilter));
            StartActivityForResult(searchFilterIntent, NavigationDrawer.NavActivity.SearchFilterRequestCode);
        }
    }
}