using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Views;
using Android.Widget;

namespace ChiKoja.SearchAd.SearchFilter
{
    class SearchCriteriaDefault : Fragment
    {
        private Context _context;
        View rootView;

        public SearchCriteriaDefault()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.search_criteria_default, container, false);

            initializeFields();
            initializeEvents();

            return rootView;
        }

        private void initializeFields()
        {

        }

        private void initializeEvents()
        {

        }

    }
}