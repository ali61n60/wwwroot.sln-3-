using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ChiKoja.AdCommonService;

namespace ChiKoja.Repository.Filter
{ 
    public class SearchFilterRepository
    {
        //TODO store search filters in preferences
        CommonFilter commonFilter;

        public SearchFilterRepository()
        {
            commonFilter=new CommonFilter();
        }

        public void InsertSearchFilters(List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput)
        {
            commonFilter.InsertSearchFilters(userInput);
        }
    }
}