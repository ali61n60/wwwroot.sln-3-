using System.Diagnostics.CodeAnalysis;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Support.V4.App;
using Android.Views;
using ChiKoja.Activities.SearchAd.SearchFilter;

namespace ChiKoja.Activities.SearchAd
{
    class SearchAdFilterFragment : Fragment
    {
        private Context _context;
        View _rootView;
        AppCompatButton _buttonFilter;
        
        [SuppressMessage("ReSharper", "EmptyConstructor")]
        public SearchAdFilterFragment()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            _rootView = inflater.Inflate(Resource.Layout.search_ad_filter_frag, container, false);

            initializeFields();
            initializeEvents();

            return _rootView;
        }

        public override void OnAttach(Context context)
        {
            base.OnAttach(context);
            _context = context;
        }

        private void initializeFields()
        {
            _buttonFilter = _rootView.FindViewById<AppCompatButton>(Resource.Id.buttonFilter);
            
        }

        private void initializeEvents()
        {
            _buttonFilter.Click += (sender, args) =>
            {
                Intent searchFilterIntent = new Intent(_context, typeof(SearchFilterActivity));
                Activity.StartActivityForResult(searchFilterIntent, SearchAdActivity.SearchFilterRequestCode);
            };   
        }      
    }
}