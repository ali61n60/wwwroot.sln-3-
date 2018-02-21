using System.Collections.Generic;
using Android.Support.V4.App;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    //TODO create a class for each of these:
    //CarModelBrand
    //PriceType
    //OrderBy
    //Default
    //AdTransportaion
    //

    public abstract class SearchFilterBaseCriteria:Fragment
    {
        public abstract void PersistUserFilter();
        public abstract void FillUserInputSearchFilter(Dictionary<string, string> userInputDictionary);
        public abstract void ClearPreferences();

    }
}