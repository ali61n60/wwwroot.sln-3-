using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        
        DistrictRepository districtRepository;
        SearchFilterRepository searchFilterRepository;
        
        int _currentRequestIndex = 0;
        string NumberOfItemsKey = "numberOfItems";
        string RequestIndexKey = "RequestIndex";
        
        private string MinimumPriceKey = "MinimumPrice";
        private string MaximumPriceKey = "MaximumPrice";
        private string OrderByKey = "OrderBy";


        public AdApi()
        {
           // districtRepository = new DistrictRepository(Repository.Repository.DataBasePath);
           
           // searchFilterRepository = new SearchFilterRepository();
            
        }
        public async Task<ResponseBase<AdvertisementCommon[]>> GetAdvertisementCommon(Dictionary<string, string> userInputDictionary)
        {
            _currentRequestIndex++;
            userInputDictionary[RequestIndexKey] = _currentRequestIndex.ToString();
            //searchFilterRepository.InsertSearchFilters(userInputDictionary);//insert search filter into user input to be sent to server
            //KeyValuePair<string, string> districtPair = districtRepository.GetDistrictDictionary();
            //userInputDictionary.Add(districtPair.Key, districtPair.Value);
            

           
            ResponseBase<AdvertisementCommon[]> response=  await ServicesCommon.CallService<AdvertisementCommon[]>("api/AdApi/GetAdvertisementCommon", userInputDictionary);
            return response;
        }

        public async Task<ResponseBase<AdvertisementCommon>> GetAdDetail(AdDetailInfo adDetailInfo)
        {
            ResponseBase<AdvertisementCommon> response =await ServicesCommon.CallService<AdvertisementCommon>("api/AdApi/GetAdDetail", adDetailInfo);

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

       
       
    }
}