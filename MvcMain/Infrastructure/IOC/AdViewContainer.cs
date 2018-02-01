using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;

namespace MvcMain.Infrastructure.IOC
{
    public class AdViewContainer
    {
        private static readonly Dictionary<int, string> _adDetailViewContainer=new Dictionary<int, string>();
        private static readonly Dictionary<int, string> _searchAdPartialViewContainer = new Dictionary<int, string>();
        private static readonly Dictionary<int, string> _newAdAdPartialViewContainer = new Dictionary<int, string>();
        private static readonly Dictionary<int, string> _letMeKnowPartialViewContainer = new Dictionary<int, string>();


        private static int defaultCategoryId = 0;
        static AdViewContainer()
        {
            RegisterAdDetailViews();
            RegisterSearchAdPartialViewContainer();
            RegisterNewAdPartialViewContainer();
            RegisterLetMeKnowPartialViewContainer();
        }

        private static void RegisterLetMeKnowPartialViewContainer()
        {
            _letMeKnowPartialViewContainer[100] = "LetMeKnow/LetMeKnowTransformation";
            _letMeKnowPartialViewContainer[defaultCategoryId] = "LetMeKnow/LetMeKnowDefault";
        }

        private static void RegisterNewAdPartialViewContainer()
        {
            _newAdAdPartialViewContainer[100] = "NewAd/NewAdTransformation";
            _newAdAdPartialViewContainer[defaultCategoryId] = "NewAd/NewAdDefault";
        }

        private static void RegisterSearchAdPartialViewContainer()
        {
            _searchAdPartialViewContainer[100] = "Home/SearchCriteriaTransformation";
            _searchAdPartialViewContainer[defaultCategoryId] = "Home/SearchCriteriaDefault";
        }


        private static void RegisterAdDetailViews()
        {
            _adDetailViewContainer[100] = "AdDetail/AdDetailTransportation";
            _adDetailViewContainer[defaultCategoryId] = "AdDetail/AdDetailDefault";
        }

        public static string GetAdDetailViewName(int categoryId)
        {
            if (_adDetailViewContainer.ContainsKey(categoryId))
            {
                return _adDetailViewContainer[categoryId];
            }
            return _adDetailViewContainer[defaultCategoryId];
        }

        public static string GetSearchAdPartialViewName(int categoryId)
        {
            if (_searchAdPartialViewContainer.ContainsKey(categoryId))
            {
                return _searchAdPartialViewContainer[categoryId];
            }
            return _searchAdPartialViewContainer[defaultCategoryId];
        }

        public static string GetNewAdPartialViewName(int categoryId)
        {
            if (_newAdAdPartialViewContainer.ContainsKey(categoryId))
            {
                return _newAdAdPartialViewContainer[categoryId];
            }
            return _newAdAdPartialViewContainer[defaultCategoryId];
        }

        public static string GetLetMeKnowPartialViewName(int categoryId)
        {
            if (_letMeKnowPartialViewContainer.ContainsKey(categoryId))
            {
                return _letMeKnowPartialViewContainer[categoryId];
            }
            return _letMeKnowPartialViewContainer[defaultCategoryId];
        }
    }
}
