using System;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Support.V4.App;
using Android.Views;
using ChiKoja.Categories;
using ChiKoja.Interfaces.SingleAd;
using ChiKoja.Models;
using ChiKoja.SearchAd.SearchFilter;

namespace ChiKoja.SearchAd
{
    class SearchFilterFragment : Fragment
    {
        private ISingleAdEvents _singleAdEvents;
        private Context _context;
        View rootView;
        AppCompatButton buttonFilter;
        
        public SearchFilterFragment()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.search_filter, container, false);

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
            
        }

        private void initializeEvents()
        {
            buttonFilter.Click += (sender, args) =>
            {
                Intent searchFilterIntent = new Intent(_context, typeof(SearchFilterActivity));
                StartActivityForResult(searchFilterIntent, NavigationDrawer.NavActivity.SearchFilterRequestCode);
            };   
        }      
    }
}