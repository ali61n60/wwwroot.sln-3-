using System;
using System.Collections.Generic;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Text;
using Android.Views;
using Android.Widget;
using ChiKoja.Infrastructure;
using ModelStd.Advertisements.Price;
using ModelStd.Db.Ad;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchFilterCriteriaDefaultFragment : SearchFilterBaseCriteria
    {      
        private Context _context;
        View _rootView;

        
       

        public SearchFilterCriteriaDefaultFragment()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            _rootView = inflater.Inflate(Resource.Layout.search_filter_criteria_default_frag, container, false);

            initializeFields();
            initializeEvents();
            updateFieldsFromSavedPreferences();

            return _rootView;
        }

        
        private void initializeFields()
        {
           
        }

        private void initializeEvents()
        {
           
        }

        private void updateFieldsFromSavedPreferences()
        {
           
        }

        

        public override void PersistUserFilter()
        {
           
        }

      

        public override void FillUserInputSearchFilter(Dictionary<string, string> userInputDictionary)
        {
            
            
            
        }

        public override void ClearPreferences()
        {
            throw new NotImplementedException();
        }
    }
}