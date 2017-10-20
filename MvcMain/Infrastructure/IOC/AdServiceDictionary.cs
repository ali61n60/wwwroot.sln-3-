using System;
using System.Collections.Generic;
using ModelStd.Advertisements;
using MvcMain.Infrastructure.Services;


namespace MvcMain.Infrastructure.IOC
{
    public static class AdServiceDictionary
    {
        private static readonly Dictionary<int, IAdvertisementService> _serviceDictionary = new Dictionary<int, IAdvertisementService>();
        private static int _defaultCategoryId = 0;
        static AdServiceDictionary()
        {
            InitializeDictionary();
        }
        private static void InitializeDictionary()
        {
            _serviceDictionary.Add(0, new AdvertisementCommonService());
            _serviceDictionary.Add(100, new AdvertisementTransportationService());
        }
        public static IAdvertisementService GetAdvertisementService(int categoryId)
        {
            if (_serviceDictionary.ContainsKey(categoryId))
                return _serviceDictionary[categoryId];
            else
                return _serviceDictionary[_defaultCategoryId];//default
        }
    }

   

       

     
}
