using System.Collections.Generic;
using Android.Support.V4.App;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public abstract class SearchFilterCategorySpecificBaseCriteria:Fragment
    {
        public abstract void PersistUserFilter();

        public abstract void FillCategorySpecificUserInputSearchFilter(Dictionary<string, string> userInputDictionary);
    }
}