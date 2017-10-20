using System;
using System.Collections.Generic;
using System.Linq;
using ModelStd.Advertisements;
using ModelStd.IRepository;
using ModelStd.Services;
using Microsoft.Extensions.DependencyInjection;


namespace MvcMain.Infrastructure.Services
{
    
    public class AdvertisementCommonService : IAdvertisementService ,IAdvertisementCommonService
    {
        //TODO make _response method field
        ResponseBase<AdvertisementCommon[]> _response;
        ResponseBase _responseBase;
        private readonly IRepository<AdvertisementCommon> _advertisementCommonRepository;
        private readonly IImageRepository _imageRepository;
        // RegistrationService registrationService;//TODO put it in Bootstrapper

        private readonly string NumberOfItemsKey = "numberOfItems";
        
        public AdvertisementCommonService
            (IRepository<AdvertisementCommon> advertisementCommonRepository, IImageRepository imageRepository)
        {
            _advertisementCommonRepository = advertisementCommonRepository;
            _imageRepository = imageRepository;
          //  registrationService = new RegistrationService();
        }

        public AdvertisementCommonService()
        {
            _advertisementCommonRepository= AppServiceProvider.Instance.GetService<IRepository<AdvertisementCommon>>();
            _imageRepository = AppServiceProvider.Instance.GetService<IImageRepository>();
        }
       
        //Main Method that get data from database
        public ResponseBase<AdvertisementCommon[]> GetAdvertisements(int startIndex, int count, Dictionary<string, string> userInput)
        {
            string errorCode = "AdvertisementCommonService.GetAdvertisements";
            _response = new ResponseBase<AdvertisementCommon[]>();
            try
            {
                AdvertisementCommon[] advertisementCommons =
                    _advertisementCommonRepository.FindBy(userInput, startIndex, count).ToArray();//get attributes 
                FillFirstImage(advertisementCommons);//get Images
                //TODO create a column (has pictures) in advertisement table and check this filter at database 
                checkAndCorrectOnlyWithPicturesFilter(userInput, advertisementCommons);
            }
            catch (Exception ex)
            {
                _response.ResponseData = null;
                _response.SetFailureResponse(ex.Message, errorCode);
            }
            return _response;
        }

       

        private void checkAndCorrectOnlyWithPicturesFilter(Dictionary<string, string> userInput, AdvertisementCommon[] advertisementCommons)
        {
            List<AdvertisementCommon> adCommonList = new List<AdvertisementCommon>();
            if (userInput.ContainsKey("OnlyWithPictures") && userInput["OnlyWithPictures"] == "True") // OnlyWithPictures filter set
            {
                foreach (AdvertisementCommon advertisementCommon in advertisementCommons)
                {
                    if (advertisementCommon.AdvertisementImages[0] != null)
                        adCommonList.Add(advertisementCommon);
                }
                setResponse(adCommonList.ToArray(),advertisementCommons.Length);//set only with pictures ads
            }
            else // OnlyWithPictures filter NOT set
            {
                setResponse(advertisementCommons, advertisementCommons.Length);//set all ads
            }
        }


        private void setResponse(AdvertisementCommon[] advertisementCommons, int numberOfItemsRetrievedFromDatabase)
        {
            Dictionary<string, string> customDictionary =
                new Dictionary<string, string> {{NumberOfItemsKey, numberOfItemsRetrievedFromDatabase.ToString()}};
            _response.ResponseData = advertisementCommons;

            _response.SetSuccessResponse("OK");
            _response.CustomDictionary = customDictionary;
        }

        public ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon(int startIndex, int count, Dictionary<string, string> userInput)
        {
            throw new NotImplementedException();
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

        public ResponseBase IncrementNumberOfVisit(Guid adGuid)
        {
            throw new NotImplementedException();
        }

        public void FillFirstImage(AdvertisementCommon[] advertisementCommons)
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
            throw new NotImplementedException();
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

        //public ResponseBase IncrementNumberOfVisit(Guid adGuid)
        //{
        //    string errorCode = "AdvertisementCommonService.IncrementNumberOfVisit";
        //    ResponseBase responseBase=new ResponseBase();
        //    try
        //    {
        //        _advertisementCommonRepository.IncrementNumberOfVisit(adGuid);
        //        responseBase.SetSuccessResponse("OK");
        //    }
        //    catch (Exception ex)
        //    {
        //        responseBase.SetFailureResponse(ex.Message,errorCode);
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
    }
}
