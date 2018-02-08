using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;

namespace MvcMain.Infrastructure.IOC
{
    public class AdViewContainer
    {
        private static readonly Dictionary<int, string> _adDetailViewContainer=new Dictionary<int, string>();
        private static readonly Dictionary<int, string> _searchAdPartialViewContainer = new Dictionary<int, string>();
        private static readonly Dictionary<int, string> _newAdAdPartialViewContainer = new Dictionary<int, string>();
        private static readonly Dictionary<int, string> _letMeKnowPartialViewContainer = new Dictionary<int, string>();


        
        static AdViewContainer()
        {
            RegisterAdDetailViewContainer();
            RegisterSearchAdPartialViewContainer();
            RegisterNewAdPartialViewContainer();
            RegisterLetMeKnowPartialViewContainer();
        }

        private static void RegisterLetMeKnowPartialViewContainer()
        {
            _letMeKnowPartialViewContainer[100] = "LetMeKnow/LetMeKnowTransformation";
            _letMeKnowPartialViewContainer[Category.CategoryIdDefault] = "LetMeKnow/LetMeKnowDefault";
        }

        private static void RegisterNewAdPartialViewContainer()
        {
            _newAdAdPartialViewContainer[100] = "NewAd/NewAdTransformation";
            _newAdAdPartialViewContainer[Category.CategoryIdDefault] = "NewAd/NewAdDefault";
        }

        private static void RegisterSearchAdPartialViewContainer()
        {
            _searchAdPartialViewContainer[100] = "Home/SearchCriteriaTransformation";
            _searchAdPartialViewContainer[Category.CategoryIdDefault] = "Home/SearchCriteriaDefault";
        }


        private static void RegisterAdDetailViewContainer()
        {
            _adDetailViewContainer[100] = "AdDetail/AdDetailTransportation";
            _adDetailViewContainer[Category.CategoryIdDefault] = "AdDetail/AdDetailDefault";
        }

        public static string GetAdDetailViewName(int categoryId)
        {
            if (_adDetailViewContainer.ContainsKey(categoryId))
            {
                return _adDetailViewContainer[categoryId];
            }
            return _adDetailViewContainer[Category.CategoryIdDefault];
        }

        public static string GetSearchAdPartialViewName(int categoryId)
        {
            if (_searchAdPartialViewContainer.ContainsKey(categoryId))
            {
                return _searchAdPartialViewContainer[categoryId];
            }
            return _searchAdPartialViewContainer[Category.CategoryIdDefault];
        }

        public static string GetNewAdPartialViewName(int categoryId)
        {
            if (_newAdAdPartialViewContainer.ContainsKey(categoryId))
            {
                return _newAdAdPartialViewContainer[categoryId];
            }
            return _newAdAdPartialViewContainer[Category.CategoryIdDefault];
        }

        public static string GetLetMeKnowPartialViewName(int categoryId)
        {
            if (_letMeKnowPartialViewContainer.ContainsKey(categoryId))
            {
                return _letMeKnowPartialViewContainer[categoryId];
            }
            return _letMeKnowPartialViewContainer[Category.CategoryIdDefault];
        }
    }
}
