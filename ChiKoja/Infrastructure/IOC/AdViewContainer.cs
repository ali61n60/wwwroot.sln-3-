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
        private static readonly Dictionary<int, Android.Support.V4.App.Fragment> _adDetailFragmentContainer = new Dictionary<int, Android.Support.V4.App.Fragment>();

        static AdViewContainer()
        {
            RegisterAdDetailFragmentContainer();
            
        }

        private static void RegisterAdDetailFragmentContainer()
        {
            _adDetailFragmentContainer[100] = new AdDetailTransportationFragment();
            _adDetailFragmentContainer[Category.CategoryIdDefault] = new AdDetailDefaultFragment();
        }

        public static Android.Support.V4.App.Fragment GetAdDetailViewFragment(int categoryId)
        {
            if (_adDetailFragmentContainer.ContainsKey(categoryId))
            {
                return _adDetailFragmentContainer[categoryId];
            }
            return _adDetailFragmentContainer[Category.CategoryIdDefault];
        }
    }
}