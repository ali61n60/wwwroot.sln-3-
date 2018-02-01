using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChiKoja.AdDetail;
using ChiKoja.Repository;
using ChiKoja.Repository.Filter;
using ChiKoja.Repository.Location;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Services;
using ServiceLayer;


namespace ChiKoja.Services.Server
{
    public class AdApi:IAdApi
    {
        CategoryRepository categoryRepository;
        DistrictRepository districtRepository;
        SearchFilterRepository searchFilterRepository;
        int _start = 1;
        int _initalStart = 1;
        int _count = 15;
        int _currentRequestIndex = 0;
        string NumberOfItemsKey = "numberOfItems";
        string RequestIndexKey = "RequestIndex";
        private string StartIndexKey = "StartIndex";
        private string CountKey = "Count";
        private string CategoryIdKey = "CategoryId";
        private string MinimumPriceKey = "MinimumPrice";
        private string MaximumPriceKey = "MaximumPrice";
        private string OrderByKey = "OrderBy";


        public AdApi()
        {
           // districtRepository = new DistrictRepository(Repository.Repository.DataBasePath);
           // categoryRepository = new CategoryRepository(Repository.Repository.DataBasePath);
           // searchFilterRepository = new SearchFilterRepository();
            
        }
        public async Task<ResponseBase<AdvertisementCommon[]>> GetAdvertisementCommon(Dictionary<string, string> userInput)
        {
            return  await ServicesCommon.CallService<AdvertisementCommon[]>("api/AdApi/GetAdvertisementCommon", userInput);
        }

       
        public async Task<ResponseBase<AdvertisementCommon[]>> GetAdFromServer()
        {
            Dictionary<string, string> userInputDictionary = new Dictionary<string, string>();
            _currentRequestIndex++;
            userInputDictionary[RequestIndexKey] = _currentRequestIndex.ToString();
            //searchFilterRepository.InsertSearchFilters(userInputDictionary);//insert search filter into user input to be sent to server
            //KeyValuePair<string, string> districtPair = districtRepository.GetDistrictDictionary();
            //userInputDictionary.Add(districtPair.Key, districtPair.Value);
            //KeyValuePair<string, string> categoryIdPair = categoryRepository.GetCategoryIdDictionary();
            //userInputDictionary.Add(categoryIdPair.Key, categoryIdPair.Value);
            userInputDictionary[StartIndexKey] = _start.ToString();
            userInputDictionary[CountKey] = _count.ToString();
            
            ResponseBase<AdvertisementCommon[]> response=await GetAdvertisementCommon(userInputDictionary);
            return response;
        }

        private bool localRequestIndexMatchsServerResponse(Dictionary<string, string> resultCustomDictionary)
        {
            foreach (KeyValuePair<string, string> keyValueOfstringstring in resultCustomDictionary)
            {
                if (keyValueOfstringstring.Key == RequestIndexKey)
                {
                    int serverRequestIndex = Parser.ParseInt(keyValueOfstringstring.Value, 0);
                    return _currentRequestIndex == serverRequestIndex;
                }
            }
            return false;//requestIndex not found
        }


        public void GetUserAdsFromeServer(string username, string password)
        {
            //Handler mainHandler = new Handler(Application.Context.MainLooper);
            //CryptoGraphy cryptoGraphy = new CryptoGraphy();

            //_currentRequestIndex++;
            //List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput = new List
            //    <ArrayOfKeyValueOfstringstringKeyValueOfstringstring>
            //{
            //    new ArrayOfKeyValueOfstringstringKeyValueOfstringstring()
            //    {
            //        Key = RequestIndexKey,
            //        Value = _currentRequestIndex.ToString()
            //    }
            //};
            //new Thread(() =>
            //{
            //    try
            //    {
            //        ResponseBase<AdvertisementCommon[]> response =
            //            adCommonService.GetCustomerAdvertisementCommon(cryptoGraphy.EncryptWithServerKey(username),
            //    cryptoGraphy.EncryptWithServerKey(password), true, true);
            //        mainHandler.Post(() => { searchAdResult.OnSerachAdCompleted(response); });
            //    }
            //    catch (Exception ex)
            //    {
            //        mainHandler.Post(() => { searchAdResult.OnSearchAdError(ex); });
            //    }
            //}).Start();
        }

        public async Task GetAdTransportationDetailFromServer(Guid adId,IAdDetailCallBack<ResponseBase<AdvertisementTransportation>> adDetailCallBack)
        {
            //TODO research what heppen if adDetailCallBack is destroyed or stopped when calling it
            //TODO get ad detail from server and show data to user
            //TODO use a call back method when completed
            //TODO do not block the calling thread
            
            ResponseBase<AdvertisementTransportation> response =
                await ServicesCommon.CallService<AdvertisementTransportation>("api/AdApi/GetTransportationAdDetail",adId);
            
            adDetailCallBack.DataFromServer(response);
            
        }

        public void ResetSearchCondition()
        {
            _start = _initalStart;
        }
    }
}