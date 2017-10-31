using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Infrastructure.Services;
using RepositoryStd.Context.Helper;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.IRepository;
using RepositoryStd.Repository;


namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdApiController : Controller, IAdvertisementCommonService
    {
        private readonly IRepository<AdvertisementCommon> _advertisementCommonRepository;
        private readonly ICommonRepository _commonRepository;
        private readonly IImageRepository _imageRepository;
        // RegistrationService registrationService;//TODO put it in Bootstrapper
        private readonly string numberOfItemsKey = "numberOfItems";
        private readonly string onlyWithPicturesKey= "OnlyWithPictures";
        private readonly string requestIndexKey = "RequestIndex";

        public AdApiController()
        {
            _advertisementCommonRepository = MyService.Inst.GetService<IRepository<AdvertisementCommon>>();
            _commonRepository = MyService.Inst.GetService<ICommonRepository>();
            _imageRepository = MyService.Inst.GetService<IImageRepository>();
        }



        public JsonResult SayHello([FromQuery][FromBody] string name, int numberOfCalls)
        {
            return Json(String.Format("Hello {0},Number is {1} current server time is: {2}", name, numberOfCalls, DateTime.Now.ToString()));
        }

        public string WhatTimeIsIt()
        {
            return DateTime.Now.ToString();
        }

        public string Ali()
        {
            return "REZANEJATI";
        }

        //Called from android and home controller
        public ResponseBase<IList<AdvertisementCommon>> GetAdvertisementCommon([FromBody] Dictionary<string, string> userInput)
        {
            string errorCode = "AdApiController.GetAdvertisementCommon";
            int startIndex = ParameterExtractor.ExtractStartIndex(userInput);
            int count = ParameterExtractor.ExtractCount(userInput);
            ResponseBase<IList<AdvertisementCommon>> response = new ResponseBase<IList<AdvertisementCommon>>();

            try
            {
                response.ResponseData =_advertisementCommonRepository.FindBy(userInput, startIndex, count).ToList();//get attributes 
                FillFirstImage(response.ResponseData);//get Images
                //TODO create a column (has pictures) in advertisement table and check this filter at database 
                checkAndCorrectOnlyWithPicturesFilter(response, userInput);
                Dictionary<string, string> customDictionary =new Dictionary<string, string>
                {
                    { numberOfItemsKey, response.ResponseData.Count.ToString() }
                };
                
                response.SetSuccessResponse("OK");
                response.CustomDictionary = customDictionary;
            }
            catch (Exception ex)
            {
                response.ResponseData = null;
                response.SetFailureResponse(ex.Message, errorCode);
            }
            setRequestIndex(userInput, response);
            return response;
        }
        public void FillFirstImage(IEnumerable<AdvertisementCommon> advertisementCommons)
        {
            foreach (AdvertisementCommon advertisement in advertisementCommons)
            {
                FillFirstImage(advertisement);
            }
        }
        public void FillFirstImage(AdvertisementCommon advertisementCommon)
        {
            advertisementCommon.AdvertisementImages[0] =
                _imageRepository.GetFirstAdvertisementImage(advertisementCommon.AdvertisementId);
        }

        public void FillAllImages(AdvertisementCommon[] advertisementCommons)
        {
            throw new NotImplementedException();
        }

        public void FillAllImages(AdvertisementCommon advertisementCommon)
        {
            advertisementCommon.AdvertisementImages = _imageRepository.GetAllAdvertisementImages(advertisementCommon.AdvertisementId);
        }
        
        private void checkAndCorrectOnlyWithPicturesFilter(ResponseBase<IList<AdvertisementCommon>> response, Dictionary<string, string> userInput)
        {
            if (userInput.ContainsKey(onlyWithPicturesKey) && userInput[onlyWithPicturesKey] == "True") // OnlyWithPictures filter set
            {
                foreach (AdvertisementCommon advertisementCommon in response.ResponseData)
                {
                    if (advertisementCommon.AdvertisementImages[0] == null)
                        response.ResponseData.Remove(advertisementCommon);
                }
            }
        }
        
        public ResponseBase<AdvertisementCommon[]> GetCustomerAdvertisementCommon(string userName, string password, bool userPassIsEncrypted)
        {
            throw new NotImplementedException();
        }

        public ResponseBase RemoveAdvertisement(AdvertisementCommon advertisementCommon)
        {
            throw new NotImplementedException();
        }

        public ResponseBase ExtendAdvertisement(AdvertisementCommon advertisement)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseBase> IncrementNumberOfVisit(Guid adGuid)
        {
            string errorCode = "AdApiController.IncrementNumberOfVisit";
            ResponseBase response = new ResponseBase();
            try
            {
                await _commonRepository.IncrementNumberOfVisit(adGuid);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }
            return response;
        }

        public ResponseBase SaveAdImages(AdvertisementCommon advertisementCommon)
        {
            throw new NotImplementedException();
        }


        //public ResponseBase<AdvertisementCommon[]> GetCustomerAdvertisementCommon(string username, string password, bool userPassIsEncrypted)
        //{
        //    string errorCode = "AdvertisementCommonService.GetCustomerAdvertisementCommon";
        //    AdvertisementCommon[] advertisementCommons;
        //    _response = new ResponseBase<AdvertisementCommon[]>();
        //    if (userPassIsEncrypted)
        //    {
        //        username = CryptoService.Decrypt(username);
        //        password = CryptoService.Decrypt(password);
        //    }
        //    ResponseBase userPassResponseBase = registrationService.ValidateUser(username, password);
        //    if (!userPassResponseBase.Success)//error in username/password
        //    {
        //        _response.SetFailureResponse(userPassResponseBase.Message, errorCode + ", " + userPassResponseBase.ErrorCode);
        //        return _response;
        //    }

        //    try
        //    {
        //        advertisementCommons = _advertisementCommonRepository.GetUserAdvertisements(username).ToArray();
        //        FillFirstImage(advertisementCommons);//get Images
        //        _response.ResponseData = advertisementCommons;
        //        _response.SetSuccessResponse();
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.ResponseData = null;
        //        _response.SetFailureResponse(ex.Message, errorCode);
        //    }
        //    return _response;
        //}

        //public ResponseBase RemoveAdvertisement(AdvertisementCommon advertisementCommon)
        //{
        //    //deleteing from database and file system must be transactional
        //    _responseBase = removeDataBaseRecords(advertisementCommon);
        //    if (_responseBase.Success)//remove Ad pictures
        //    {
        //        _imageRepository.RemoveAdvertisementImages(advertisementCommon.AdvertisementId);
        //        //what if error in deleting images!!!!
        //        //TODO if error log the error and deal with it later
        //    }
        //    return _responseBase;
        //}

        //private ResponseBase removeDataBaseRecords(AdvertisementCommon advertisementCommon)
        //{
        //    return AdServiceDictionary.GetAdvertisementService(advertisementCommon.AdvertisementCategoryId).RemoveAd(advertisementCommon);
        //}

        //public ResponseBase RemoveAd(AdvertisementCommon advertisementCommon)
        //{
        //    throw new ApplicationException("Common service does not implement RemoveAd method");
        //}

        //public ResponseBase ExtendAdvertisement(AdvertisementCommon advertisement)
        //{
        //    string errorCode = "AdvertisementCommonService.ExtendAdvertisement";
        //    ResponseBase responseBase = new ResponseBase();
        //    advertisement.AdvertisementTime = DateTime.Now;
        //    try
        //    {
        //        _advertisementCommonRepository.Save(advertisement);
        //        responseBase.SetSuccessResponse();
        //    }
        //    catch (Exception ex)
        //    {
        //        responseBase.SetFailureResponse(ex.Message, errorCode);
        //    }
        //    return responseBase;
        //}

        

        //public ResponseBase SaveAdImages(AdvertisementCommon advertisementCommon)
        //{
        //    string errorCode = "AdvertisementCommonService.SaveAdImages";
        //    ResponseBase responseBase = new ResponseBase();
        //    try
        //    {
        //        if (advertisementCommon.AdvertisementImages != null)
        //        {
        //            _imageRepository.SaveImages(advertisementCommon.AdvertisementId, advertisementCommon.AdvertisementImages);
        //            responseBase.SetSuccessResponse("Advertisement images saved in repository");
        //        }
        //        else
        //        {
        //            responseBase.SetSuccessResponse("advertisementCommon.AdvertisementImages is Null");
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        responseBase.SetFailureResponse("Error in Saving Advertisement images in repository", errorCode);
        //    }
        //    return responseBase;
        //}

        //private int getSelectedCategoryId(Dictionary<string, string> userInput)
        //{
        //    int selectedCategoryId = 0;
        //    if (userInput != null && userInput.ContainsKey("CategoryId"))
        //    {
        //        if (!int.TryParse(userInput["CategoryId"], out selectedCategoryId))
        //        {
        //            selectedCategoryId = 0;
        //        }
        //    }
        //    return selectedCategoryId;
        //}



        //public void FillAllImages(AdvertisementCommon[] advertisementCommons)
        //{
        //    foreach (AdvertisementCommon advertisement in advertisementCommons)
        //    {
        //        FillAllImages(advertisement);
        //    }
        //}

        //public void FillAllImages(AdvertisementCommon advertisementCommon)
        //{
        //    advertisementCommon.AdvertisementImages =
        //            _imageRepository.GetAllAdvertisementImages(advertisementCommon.AdvertisementId);
        //}

        ////test
        //public string WhatTimeIsIt(string name)
        //{
        //    return "Hello " + name + " , time is: " + DateTime.Now.ToString(CultureInfo.InvariantCulture);
        //}

        ////test
        //public string TestNameValue(string name, Dictionary<string, string> userDictionary)
        //{
        //    string returnString = "Hello " + name + " , How Are You? You entered the following data:";
        //    foreach (var key in userDictionary.Keys)
        //    {
        //        returnString += " key is:" + key + " , and value is:" + userDictionary[key] + "||||";
        //    }
        //    return returnString;
        //}


            
        public ResponseBase<AdvertisementTransportation> GetTransportationAdDetail([FromBody] Guid adId)
        {
            IAdvertisementTransportationService transportationService =MyService.Inst.GetService<IAdvertisementTransportationService>();
            return transportationService.GetAdDetail(adId);
        }

       
        private void setRequestIndex(Dictionary<string, string> userInput, ResponseBase<IList<AdvertisementCommon>> response)
        {
            if (userInput.ContainsKey(requestIndexKey))
            {
                if (response.CustomDictionary != null)
                    response.CustomDictionary[requestIndexKey] = userInput[requestIndexKey];
                else
                    response.CustomDictionary = new Dictionary<string, string> { { requestIndexKey, userInput[requestIndexKey] } };
            }
        }
    }


}
