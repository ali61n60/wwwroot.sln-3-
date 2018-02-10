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
using ChiKoja.AdDetail;
using ModelStd.Db.Ad;

namespace ChiKoja.Infrastructure.IOC
{
    public class AdViewContainer
    {
        private static readonly Dictionary<int, CategorySpecificBaseFragment> _adDetailFragmentContainer = new Dictionary<int, CategorySpecificBaseFragment>();

        static AdViewContainer()
        {
            RegisterAdDetailFragmentContainer();
            
        }

        private static void RegisterAdDetailFragmentContainer()
        {
            _adDetailFragmentContainer[100] = new AdDetailTransportationFragment();
            _adDetailFragmentContainer[Category.CategoryIdDefault] = new AdDetailDefaultFragment();
        }

        public static CategorySpecificBaseFragment GetCategorySpecificAdDetailViewFragment(int categoryId)
        {
            if (_adDetailFragmentContainer.ContainsKey(categoryId))
            {
                return _adDetailFragmentContainer[categoryId];
            }
            return _adDetailFragmentContainer[Category.CategoryIdDefault];
        }
    }
}