using System;
using System.Collections.Generic;
using System.IO;
using System.Json;
using System.Net;
using System.Threading.Tasks;
using Android.App;
using Android.OS;
using Android.Widget;
using ChiKoja.AdCommonService;
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
        AdvertisementCommonService adCommonService;
        CategoryRepository categoryRepository;
        DistrictRepository districtRepository;
        SearchFilterRepository searchFilterRepository;
        int _start = 1;
        int _initalStart = 1;
        int _count = 15;
        int _currentRequestIndex = 0;
        string NumberOfItemsKey = "numberOfItems";
        string RequestIndexKey = "RequestIndex";

        public SearchAdService()
        {
            districtRepository = new DistrictRepository(Repository.Repository.DataBasePath);
            categoryRepository = new CategoryRepository(Repository.Repository.DataBasePath);
            searchFilterRepository = new SearchFilterRepository();
            adCommonService = new AdvertisementCommonService();
        }

        public async void GetAdFromServer(ISearchAdResult searchAdResult)
        {
            Dictionary<string, string> userInputDictionary = new Dictionary<string, string>();
            userInputDictionary["StartIndex"] = "1";
            userInputDictionary["Count"] = "5";
            userInputDictionary["RequestIndex"] = "1";
            try
            {
                string url = "http://192.168.42.76/api/AdApi/GetAdvertisementCommon";
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
                using (WebResponse response = await request.GetResponseAsync())
                {
                    // Get a stream representation of the HTTP web response:
                    using (Stream stream = response.GetResponseStream())
                    {
                        // Use this stream to build a JSON document object:
                        JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
                        ResponseBase<AdvertisementCommon[]> result =
                            JsonConvert.DeserializeObject<ResponseBase<AdvertisementCommon[]>>(jsonDoc.ToString());
                        
                    }
                }
            }
            catch (Exception ex)
            {
                searchAdResult.OnSearchAdError(ex);
            }




















            Handler mainHandler = new Handler(Application.Context.MainLooper);
            _currentRequestIndex++;
            List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput = new List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring>();
            searchFilterRepository.InsertSearchFilters(userInput);//insert search filter into user input to be sent to server
            userInput.Add(districtRepository.GetDistrictDictionary());
            userInput.Add(categoryRepository.GetCategoryIdDictionary());
            userInput.Add(new ArrayOfKeyValueOfstringstringKeyValueOfstringstring()
            {
                Key = RequestIndexKey,
                Value = _currentRequestIndex.ToString()
            });

            new Thread(() =>
            {
                try
                {
                    ResponseBaseOfArrayOfAdvertisementCommongJiz6K1p response =
                        adCommonService.GetAdvertisementCommon(_start, true, _count, true, userInput.ToArray());
                    bool inResponseToLastRequest = false;
                    if (response.Success)
                    {
                        ArrayOfKeyValueOfstringstringKeyValueOfstringstring[] resultCustomDictionary = response.CustomDictionary;
                        if (!localRequestIndexMatchsServerResponse(resultCustomDictionary))
                        {
                            return;//more request has been send to server so dismiss current server response
                        }
                        inResponseToLastRequest = true;

                        foreach (ArrayOfKeyValueOfstringstringKeyValueOfstringstring keyValueOfstringstring in resultCustomDictionary)
                        {
                            if (keyValueOfstringstring.Key == NumberOfItemsKey)
                            {
                                int numberOfItems = Parser.ParseInt(keyValueOfstringstring.Value, 0);
                                _start += numberOfItems;
                                break;
                            }
                        }
                    }
                    mainHandler.Post(() => { searchAdResult.OnSerachAdCompleted(response, inResponseToLastRequest); });

                }
                catch (Exception ex)
                {
                    mainHandler.Post(() => { searchAdResult.OnSearchAdError(ex); });
                }
            }).Start();
        }

        private bool localRequestIndexMatchsServerResponse(ArrayOfKeyValueOfstringstringKeyValueOfstringstring[] resultCustomDictionary)
        {
            foreach (ArrayOfKeyValueOfstringstringKeyValueOfstringstring keyValueOfstringstring in resultCustomDictionary)
            {
                if (keyValueOfstringstring.Key == RequestIndexKey)
                {
                    int serverRequestIndex = Parser.ParseInt(keyValueOfstringstring.Value,0);
                    return _currentRequestIndex == serverRequestIndex;
                }
            }
            return false;//requestIndex not found
        }


        public void GetUserAdsFromeServer(ISearchAdResult searchAdResult,string username,string password)
        {
            Handler mainHandler = new Handler(Application.Context.MainLooper);
            CryptoGraphy cryptoGraphy=new CryptoGraphy();
            
            _currentRequestIndex++;
            List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput = new List
                <ArrayOfKeyValueOfstringstringKeyValueOfstringstring>
            {
                new ArrayOfKeyValueOfstringstringKeyValueOfstringstring()
                {
                    Key = RequestIndexKey,
                    Value = _currentRequestIndex.ToString()
                }
            };
            new Thread(() =>
            {
                try
                {
                    ResponseBaseOfArrayOfAdvertisementCommongJiz6K1p response =
                        adCommonService.GetCustomerAdvertisementCommon(cryptoGraphy.EncryptWithServerKey(username),
                cryptoGraphy.EncryptWithServerKey(password), true, true);
                    mainHandler.Post(() => { searchAdResult.OnSerachAdCompleted(response, response.Success); });
                }
                catch (Exception ex)
                {
                    mainHandler.Post(() => { searchAdResult.OnSearchAdError(ex); });
                }
            }).Start();
        }

        public void GetAdTransportationDetailFromServer(ISearchAdTransportationResult searchAdResult,Guid adGuid)
        {
            Handler mainHandler = new Handler(Application.Context.MainLooper);
            AdvertisementTransportationService adTransportationService=new AdvertisementTransportationService();
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