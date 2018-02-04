using System.Collections.Generic;

namespace ChiKoja.Repository.Filter
{ 
    public class SearchFilterRepository
    {
        //TODO store search filters in preferences
        readonly CommonFilter commonFilter;

        public SearchFilterRepository()
        {
            commonFilter=new CommonFilter();
        }

        public void InsertSearchFilters(Dictionary<string,string> userInput)
        {
            commonFilter.InsertSearchFilters(userInput);
        }
    }
}