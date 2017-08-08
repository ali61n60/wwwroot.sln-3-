using System;
using System.Collections.Generic;
using Android.App;
using Android.OS;
using ChiKoja.AdCommonService;
using ChiKoja.AdTransportationService;
using ChiKoja.Repository;
using ChiKoja.Repository.CryptoGraphy;
using ChiKoja.Repository.Filter;
using ChiKoja.Repository.Location;
using ServiceLayer;
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

        public void GetAdFromServer(ISearchAdResult searchAdResult)
        {
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