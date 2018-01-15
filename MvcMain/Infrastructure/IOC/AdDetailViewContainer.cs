using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;

namespace MvcMain.Infrastructure.IOC
{
    public class AdDetailViewContainer
    {
        private static Dictionary<int, string> _viewContainer=new Dictionary<int, string>();
        private static Dictionary<int, Type> _responseTypeContainer = new Dictionary<int, Type>();
        private static int defaultCategoryId = 0;
        static AdDetailViewContainer()
        {
            RegisterViews();
            RegisterResponseContainer();
        }

        private static void RegisterResponseContainer()
        {
            _responseTypeContainer[100] = typeof(AdvertisementTransportation);
            _responseTypeContainer[defaultCategoryId] = typeof(AdvertisementCommon);
        }

        private static void RegisterViews()
        {
            _viewContainer[100] = "AdDetail/AdDetailTransportation";
            _viewContainer[defaultCategoryId] = "AdDetail/AdDetailDefault";
        }

        public static string GetViewName(int categoryId)
        {
            if (_viewContainer.ContainsKey(categoryId))
            {
                return _viewContainer[categoryId];
            }
            return _viewContainer[defaultCategoryId];
        }

        public static Type GetResponseType(int categoryId)
        {
            if (_responseTypeContainer.ContainsKey(categoryId))
            {
                return _responseTypeContainer[categoryId];
            }
            return _responseTypeContainer[defaultCategoryId];
        }
    }
}
