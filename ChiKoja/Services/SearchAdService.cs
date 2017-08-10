using System;
using System.Collections.Generic;
using System.IO;
using System.Json;
using System.Net;
using System.Threading.Tasks;
using Android.App;
using Android.OS;
using ChiKoja.AdTransportationService;
using ChiKoja.Repository;
using ChiKoja.Repository.CryptoGraphy;
using ChiKoja.Repository.Filter;
using ChiKoja.Repository.Location;
using ModelStd.Services;
using Newtonsoft.Json;
using ServiceLayer;
using AdvertisementCommon = ModelStd.Advertisements.AdvertisementCommon;
using ArrayOfKeyValueOfstringstringKeyValueOfstringstring = ChiKoja.AdCommonService.ArrayOfKeyValueOfstringstringKeyValueOfstringstring;
using Exception = System.Exception;
using Thread = System.Threading.Thread;

namespace ChiKoja.Services
{
    public class SearchAdService
    {
        //AdvertisementCommonService adCommonService;
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

        public SearchAdService()
        {
            districtRepository = new DistrictRepository(Repository.Repository.DataBasePath);
            categoryRepository = new CategoryRepository(Repository.Repository.DataBasePath);
            searchFilterRepository = new SearchFilterRepository();
            //adCommonService = new AdvertisementCommonService();
        }

        public async void GetAdFromServer(ISearchAdResult searchAdResult)
        {
            Dictionary<string, string> userInputDictionary = new Dictionary<string, string>();
            _currentRequestIndex++;
            userInputDictionary[RequestIndexKey] = _currentRequestIndex.ToString();
            searchFilterRepository.InsertSearchFilters(userInputDictionary);//insert search filter into user input to be sent to server
            KeyValuePair<string, string> districtPair = districtRepository.GetDistrictDictionary();
            userInputDictionary.Add(districtPair.Key, districtPair.Value);
            KeyValuePair<string, string> categoryIdPair = categoryRepository.GetCategoryIdDictionary();
            userInputDictionary.Add(categoryIdPair.Key, categoryIdPair.Value);
            userInputDictionary[StartIndexKey] = _start.ToString();
            userInputDictionary[CountKey] = _count.ToString();

            try
            {
                string url =ServicesCommon.ServerUrl+"/api/AdApi/GetAdvertisementCommon";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(url));
                request.ContentType = "application/json";
                request.Method = "POST";
                using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    string jsonData = JsonConvert.SerializeObject(userInputDictionary);
                    streamWriter.Write(jsonData);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                // Send the request to the server and wait for the response:
                using (WebResponse webResponse = await request.GetResponseAsync())
                {
                    // Get a stream representation of the HTTP web response:
                    using (Stream stream = webResponse.GetResponseStream())
                    {
                        // Use this stream to build a JSON document object:
                        JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
                        ResponseBase<AdvertisementCommon[]> response =
                            JsonConvert.DeserializeObject<ResponseBase<AdvertisementCommon[]>>(jsonDoc.ToString());
                       
                        if (response.Success)
                        {
                            Dictionary<string, string> resultCustomDictionary = response.CustomDictionary;
                            if (!localRequestIndexMatchsServerResponse(resultCustomDictionary))
                            {
                                return; //more request has been send to server so dismiss current server response
                            }
                            foreach (var keyValueOfstringstring in resultCustomDictionary)
                            {
                                if (keyValueOfstringstring.Key == NumberOfItemsKey)
                                {
                                    int numberOfItems = Parser.ParseInt(keyValueOfstringstring.Value, 0);
                                    _start += numberOfItems;
                                    break;
                                }
                            }
                            searchAdResult.OnSerachAdCompleted(response);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                searchAdResult.OnSearchAdError(ex);
            }

            
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


        public void GetUserAdsFromeServer(ISearchAdResult searchAdResult, string username, string password)
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

        public void GetAdTransportationDetailFromServer(ISearchAdTransportationResult searchAdResult, Guid adGuid)
        {
            Handler mainHandler = new Handler(Application.Context.MainLooper);
            AdvertisementTransportationService adTransportationService = new AdvertisementTransportationService();
            new Thread(() =>
            {
                try
                {
                    ResponseBaseOfAdvertisementTransportationgJiz6K1p response =
                        adTransportationService.GetAdvertisementTransportation(adGuid.ToString());
                    mainHandler.Post(() => { searchAdResult.OnSerachAdCompleted(response); });
                }
                catch (Exception ex)
                {
                    mainHandler.Post(() => { searchAdResult.OnSearchAdError(ex); });
                }
            }).Start();
        }

        public void ResetSearchCondition()
        {
            _start = _initalStart;
        }
    }
}