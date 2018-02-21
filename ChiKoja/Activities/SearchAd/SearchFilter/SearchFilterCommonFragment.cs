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

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    class SearchFilterCommonFragment: SearchFilterBaseCriteria
    {
        public override void PersistUserFilter()
        {
            throw new NotImplementedException();
        }

        public override void FillUserInputSearchFilter(Dictionary<string, string> userInputDictionary)
        {
            throw new NotImplementedException();
        }

        public override void ClearPreferences()
        {
            throw new NotImplementedException();
        }
    }
}