using System.Collections.Generic;
using ChiKoja.Activities.AdDetail;
using ChiKoja.Activities.SearchAd.SearchFilter;
using ChiKoja.Activities.SearchAd.SearchFilter.Price;
using ModelStd.Db.Ad;

namespace ChiKoja.Infrastructure.IOC
{
    public class AdViewContainer
    {
        private static readonly Dictionary<int, AdDetailCategorySpecificBaseFragment> _adDetailFragmentContainer = new Dictionary<int, AdDetailCategorySpecificBaseFragment>();
        private static readonly Dictionary<int,SearchFilterBaseCriteria> _searchFilterFragmentContainer=new Dictionary<int, SearchFilterBaseCriteria>();
        private static readonly Dictionary<int, SearchFilterBaseCriteria> _searchFilterPriceContainer=new Dictionary<int, SearchFilterBaseCriteria>();
        private static readonly SearchFilterCommonFragment _searchFilterCommonFragment;

        static AdViewContainer()
        {
            RegisterAdDetailFragmentContainer();
            RegisterSearchFilterFragmentContainer();
            RegisterSearchFilterPriceContainer();
            _searchFilterCommonFragment=new SearchFilterCommonFragment();
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

        private static void RegisterSearchFilterPriceContainer()
        {
            _searchFilterPriceContainer[Category.CategoryIdDefault] = new SearchFilterPriceDefaultFragment();
        }

        public static AdDetailCategorySpecificBaseFragment GetCategorySpecificAdDetailViewFragment(int categoryId)
        {
            if (_adDetailFragmentContainer.ContainsKey(categoryId))
            {
                return _adDetailFragmentContainer[categoryId];
            }
            return _adDetailFragmentContainer[Category.CategoryIdDefault];
        }

        public static SearchFilterBaseCriteria GetCategorySpecificSearchFilterViewFragment(int categoryId)
        {
            if (_searchFilterFragmentContainer.ContainsKey(categoryId))
            {
                return _searchFilterFragmentContainer[categoryId];
            }
            return _searchFilterFragmentContainer[Category.CategoryIdDefault];
        }

        public static SearchFilterBaseCriteria GetSearchFilterPrice(int categoryId)
        {
            if (_searchFilterPriceContainer.ContainsKey(categoryId))
            {
                return _searchFilterPriceContainer[categoryId];
            }
            return _searchFilterPriceContainer[Category.CategoryIdDefault];
        }

        public static SearchFilterCommonFragment GetSearchFilterCommon()
        {
            return _searchFilterCommonFragment;
        }
    }
}