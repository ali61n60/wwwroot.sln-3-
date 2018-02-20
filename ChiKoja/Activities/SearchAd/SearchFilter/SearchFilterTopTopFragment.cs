using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Fragment = Android.Support.V4.App.Fragment;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchFilterTopTopFragment:Fragment
    {
        private Context _context;
        View _rootView;
        AppCompatButton _buttonOk;
        AppCompatButton _buttonCancel;
        private ISetSearchFilter _setSearchFilter;

        public SearchFilterTopTopFragment()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            _rootView = inflater.Inflate(Resource.Layout.search_filter_toptop_frag, container, false);

            initializeFields();
            initializeEvents();

            return _rootView;
        }

        public override void OnAttach(Context context)
        {
            base.OnAttach(context);
            _context = context;
            if (context is ISetSearchFilter)
            {
                _setSearchFilter = context as ISetSearchFilter;
            }
            else
            {
                throw new Exception("context must implement ISetSearchFilter Interface");
            }
        }

        private void initializeFields()
        {
            _buttonOk = _rootView.FindViewById<AppCompatButton>(Resource.Id.buttonOk);
            _buttonCancel = _rootView.FindViewById<AppCompatButton>(Resource.Id.buttonCancel);
        }

        private void initializeEvents()
        {
           _buttonCancel.Click += (sender, args) =>
            {
                Activity.SetResult(Result.Canceled);
                Activity.Finish();
            };

            _buttonOk.Click += (sender, args) =>
            {
               _setSearchFilter.SetSearchFilter();
            };
        }
        
    }
}