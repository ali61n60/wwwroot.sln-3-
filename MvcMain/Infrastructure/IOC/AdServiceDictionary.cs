using System.Collections.Generic;
using MvcMain.Infrastructure.Services;


namespace MvcMain.Infrastructure.IOC
{
    public static class AdServiceDictionary
    {
        private static int _defaultCategoryId = 0;

        private static readonly Dictionary<int, IAdvertisementService<object>> _advertisementTypeDictionary
            =new Dictionary<int, IAdvertisementService<object>>();

         static AdServiceDictionary()
        {
            InitializeDictionary();
        }

        private static void InitializeDictionary()
        {
            // each catergory that is developed will have an entry here
            //TODO here I return a singlton for advertisementService class, Maybe I should return new object for
            //TODO each request
            _advertisementTypeDictionary.Add(0, new AdvertisementCommonService());
            _advertisementTypeDictionary.Add(100, new AdvertisementCommonService());//TODO change it to AddTransportationService
        }

        public static IAdvertisementService GetAdvertisementService(int categoryId)
        {
            try
            {
                return _advertisementTypeDictionary[categoryId];
            }
            catch (KeyNotFoundException)
            {
                return _advertisementTypeDictionary[_defaultCategoryId];
            }
        }
    }
}
