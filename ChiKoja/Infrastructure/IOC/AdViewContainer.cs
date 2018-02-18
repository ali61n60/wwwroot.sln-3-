using System.Collections.Generic;
using ChiKoja.Activities.AdDetail;
using ChiKoja.Activities.SearchAd.SearchFilter;
using ModelStd.Db.Ad;

namespace ChiKoja.Infrastructure.IOC
{
    public class AdViewContainer
    {
        private static readonly Dictionary<int, AdDetailCategorySpecificBaseFragment> _adDetailFragmentContainer = new Dictionary<int, AdDetailCategorySpecificBaseFragment>();
        private static readonly Dictionary<int,SearchFilterCategorySpecificBaseCriteria> _searchFilterFragmentContainer=new Dictionary<int, SearchFilterCategorySpecificBaseCriteria>();

        static AdViewContainer()
        {
            RegisterAdDetailFragmentContainer();
            RegisterSearchFilterFragmentContainer();
        }

        private static void RegisterAdDetailFragmentContainer()
        {
            _adDetailFragmentContainer[100] = new AdDetailTransportationFragment();
            _adDetailFragmentContainer[Category.CategoryIdDefault] = new AdDetailDefaultFragment();
        }

        private static void RegisterSearchFilterFragmentContainer()
        {
            _searchFilterFragmentContainer[100]=new SearchFilterCriteriaTransportationFragment();
            _searchFilterFragmentContainer[Category.CategoryIdDefault]=new SearchFilterCriteriaDefaultFragment();
        }

        public static AdDetailCategorySpecificBaseFragment GetCategorySpecificAdDetailViewFragment(int categoryId)
        {
            if (_adDetailFragmentContainer.ContainsKey(categoryId))
            {
                return _adDetailFragmentContainer[categoryId];
            }
            return _adDetailFragmentContainer[Category.CategoryIdDefault];
        }

        public static SearchFilterCategorySpecificBaseCriteria GetCategorySpecificSearchFilterViewFragment(int categoryId)
        {
            if (_searchFilterFragmentContainer.ContainsKey(categoryId))
            {
                return _searchFilterFragmentContainer[categoryId];
            }
            return _searchFilterFragmentContainer[Category.CategoryIdDefault];
        }
    }
}