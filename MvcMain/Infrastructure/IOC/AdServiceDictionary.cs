using System;
using System.Collections.Generic;
using ModelStd.Advertisements;
using MvcMain.Infrastructure.Services;


namespace MvcMain.Infrastructure.IOC
{
    public static class AdServiceDictionary
    {
        public static IAdvertisementService<T> GetAdvertisementService(Type T)
        {
            Type type = typeof(T);
            if (type == typeof(AdvertisementCommon))
                return (IAdvertisementService<T>) new AdvertisementCommonService();
            else if(type== typeof(AdvertisementTransportation))
            {
                return (IAdvertisementService<T>) new AdvertisementTransportationService();
            }

            //default
            return null;
        }
    }

    public static class TypeFactory
    {
        private static readonly Dictionary<int ,Type> _typeDictionary=new Dictionary<int, Type>();
        private static int _defaultCategoryId = 0;

        static TypeFactory()
        {
            InitializeDictionary();
        }

        private static void InitializeDictionary()
        {
            _typeDictionary.Add(0,typeof(AdvertisementCommon));
            _typeDictionary.Add(100, typeof(AdvertisementTransportation));
        }

        public static Type GeType(int categoryId)
        {
            if (_typeDictionary.ContainsKey(categoryId))
                return _typeDictionary[categoryId];
            else
                return _typeDictionary[_defaultCategoryId];
        }
    }
}
