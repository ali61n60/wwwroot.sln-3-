using System;
using System.Collections.Generic;
using System.IO;
using System.Json;
using System.Net;
using System.Threading.Tasks;
using Android.Util;
using ChiKoja.AdDetail;
using ChiKoja.Repository;
using ChiKoja.Repository.Filter;
using ChiKoja.Repository.Location;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Services;
using Newtonsoft.Json;
using ServiceLayer;
using AdvertisementCommon = ModelStd.Advertisements.AdvertisementCommon;

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
            


            //try
            //{
            //    string url = ServicesCommon.ServerUrl + "/api/AdApi/GetAdvertisementCommon";
            //    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(url));
            //    request.ContentType = "application/json";
            //    request.Method = "POST";
            //    using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            //    {
            //        string jsonData = JsonConvert.SerializeObject(userInput);
            //        streamWriter.Write(jsonData);
            //        streamWriter.Flush();
            //        streamWriter.Close();
            //    }

            //    // Send the request to the server and wait for the response:
            //    using (WebResponse webResponse = await request.GetResponseAsync())
            //    {
            //        using (Stream stream = webResponse.GetResponseStream())
            //        {
            //            JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
            //            response = JsonConvert.DeserializeObject<ResponseBase<AdvertisementCommon[]>>(jsonDoc.ToString());

            //            if (response.Success)
            //            {
            //                Dictionary<string, string> resultCustomDictionary = response.CustomDictionary;
            //                if (!localRequestIndexMatchsServerResponse(resultCustomDictionary))
            //                {
            //                    //more request has been send to server so dismiss current server response
            //                    response.Success = false;
            //                    response.Message = "more request has been send to server";
            //                    return response;
            //                }
            //                foreach (var keyValueOfstringstring in resultCustomDictionary)
            //                {
            //                    if (keyValueOfstringstring.Key == NumberOfItemsKey)
            //                    {
            //                        int numberOfItems = Parser.ParseInt(keyValueOfstringstring.Value, 0);
            //                        _start += numberOfItems;
            //                        break;
            //                    }
            //                }
            //                return response;
            //            }
            //            else
            //                throw new Exception(response.Message + " ErrorCode=" + response.ErrorCode);
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    response = new ResponseBase<AdvertisementCommon[]>
            //    {
            //        Success = false,
            //        Message = ex.Message
            //    };
            //    return response;
            //}
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