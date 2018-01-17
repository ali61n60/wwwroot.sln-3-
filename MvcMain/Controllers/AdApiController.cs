﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Infrastructure.Services;
using RepositoryStd.Context.Helper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;
using ModelStd.IRepository;
using MvcMain.Infrastructure;
using MvcMain.Models;
using RepositoryStd.Repository;
using RepositoryStd.Repository.Common;
using RepositoryStd.TepmeratureRepository;

//TODO use Test to test repositories "Image Repository" and Transformation Repository 

namespace MvcMain.Controllers
{

    //TODO 1- work on view Ad Detail, use similar ads, mark ad, share ad, ...
    //TODO 1- add mangeMyAd page for users myAds, MarkedAds
    //TODO 1- work on users credits and money pay and ...
    //TODO 1- work on Edit AD by Ad owner

    //TODO 2- study MVC book
    //TODO 2- Create Verify Ad Controller and View For Admin
    //TODO 2- Create LetMeKnow Controller and View for users to register their need
    //TODO 2- Create and Run SMS sending
    //TODO 2- return a responseBase object in api calls that need autherized access but caller is not logged in
    //TODO 3- work on Ad Price
    //TODO 3- work on the max number of images per Ad. for example decide it based on user
    //TODO 3- Make Response.Error an array and put all errors in it
    //TODO 3- work on District,City,Province component
    //TODO 3- work on ad status enum 
    //TODO 3- study about rules to operate a web site and connect to bank  and register a company
    //TODO 3- study Task and async
    //TODO 3- correct WhatIsMyIpAddress method
    //TODO 3- improve database tables datatypse and 
    //TODO 3- use Decorator pattern to log

    [Route("api/[controller]/[action]")]
    public class AdApiController : Controller, IAdvertisementCommonService
    {
        private readonly RepositoryContainer _repositoryContainer;
        private readonly ICommonRepository _commonRepository;
        private readonly IImageRepository _imageRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly TemperatureRepository _temperatureRepository;
        // RegistrationService registrationService;//TODO put it in Bootstrapper
        private readonly string numberOfItemsKey = "numberOfItems";
        private readonly string onlyWithPicturesKey = "OnlyWithPictures";
        private readonly string requestIndexKey = "RequestIndex";

        public AdApiController()
        {
            _repositoryContainer = MyService.Inst.GetService<RepositoryContainer>();
            _commonRepository = MyService.Inst.GetService<ICommonRepository>();
            _imageRepository = MyService.Inst.GetService<IImageRepository>();
            _userManager = MyService.Inst.GetService<UserManager<AppUser>>();
            _temperatureRepository = MyService.Inst.GetService<TemperatureRepository>();
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

        //TODO move this method to its controller
        public JsonResult InsertTemperature([FromQuery] int temperature)
        {
            Temperature temperatureModel = new Temperature()
            {
                InsertDateTime = DateTime.Now,
                Temp = temperature
            };

            try
            {
                _temperatureRepository.Insert(temperatureModel);
            }
            catch (Exception ex)
            {
                return Json("Error " + ex.Message);
            }
            return Json("OK");
        }

        public string WhatIsMyIpAddress()
        {
            return $"ip address={Request.HttpContext.Connection.RemoteIpAddress.ToString()}, " +
                   $"port={Request.HttpContext.Connection.RemotePort}";
        }

        public async Task<ResponseBase> AddAdvertisement([FromBody] Dictionary<string, string> userInput)
        {
            string errorCode = "AdApiController.AddAdvertisement";
            ResponseBase response = new ResponseBase();
            int categoryId = ParameterExtractor.ExtractInt(userInput, AdvertisementCommonRepository.CategoryIdKey, AdvertisementCommonRepository.CategoryIdDefault);
            IAdRepository adRepository = _repositoryContainer.GetAdRepository(categoryId);//polymorphyic dispatch
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    response.SetFailureResponse("user is null", errorCode); //magic string
                    return response;
                }
                await adRepository.Add(userInput, user.Id);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }

            return response;
            }

            //Called from android and home controller
            public ResponseBase<IList<AdvertisementCommon>> GetAdvertisementCommon([FromBody] Dictionary<string, string> userInput)
            {
                string errorCode = "AdApiController.GetAdvertisementCommon";
                ResponseBase<IList<AdvertisementCommon>> response = new ResponseBase<IList<AdvertisementCommon>>();
                int categoryId = ParameterExtractor.ExtractInt(userInput, AdvertisementCommonRepository.CategoryIdKey, AdvertisementCommonRepository.CategoryIdDefault);
                IAdRepository adRepository = _repositoryContainer.GetAdRepository(categoryId);//polymorphyic dispatch
                try
                {
                    response.ResponseData = adRepository.FindAdvertisementCommons(userInput).ToList();//get attributes 
                    FillFirstImage(response.ResponseData);//get Images
                                                          //TODO create a column (has pictures) in advertisement table and check this filter at database 
                    checkAndCorrectOnlyWithPicturesFilter(response, userInput);
                    Dictionary<string, string> customDictionary = new Dictionary<string, string>
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
                foreach (AdvertisementCommon advertisementCommon in advertisementCommons)
                {
                    advertisementCommon.AdvertisementImages[0] =
                        _imageRepository.GetFirstAdvertisementImage(advertisementCommon.AdvertisementId);

                }
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
                string errorCode = "AdApiController.SaveAdImages";
                ResponseBase responseBase = new ResponseBase();
                try
                {
                    if (advertisementCommon.AdvertisementImages != null)
                    {
                        _imageRepository.SaveImages(advertisementCommon.AdvertisementId, advertisementCommon.AdvertisementImages);
                        responseBase.SetSuccessResponse("Advertisement images saved in repository");
                    }
                    else
                    {
                        responseBase.SetSuccessResponse("advertisementCommon.AdvertisementImages is Null");
                    }
                }
                catch (Exception ex)
                {
                    responseBase.SetFailureResponse(ex.Message, errorCode);
                }
                return responseBase;
            }

        [Authorize]
        public async Task<ResponseBase<UploadedImage>> AddTempImage()
        {
            string errorCode = "AdApiController.AddTempImage";
            ResponseBase<UploadedImage> response = new ResponseBase<UploadedImage>
            {
                ResponseData = new UploadedImage
                {
                    RequestIndex = Request.Form["RequestIndex"]
                }
            };
            try
            {
                Guid currentAdGuid = Guid.Parse(Request.Form["NewAdGuid"]);//magic string
                IFormFile uploadedFile = Request.Form.Files[0];//only one file
                //TODO what if uploadedFile is null
                string filename = ContentDispositionHeaderValue.Parse(uploadedFile.ContentDisposition).FileName.Trim('"');

                ResponseBase<byte[]> thumbnailResponse = ImageService.ConvertImage(100, 100, uploadedFile.OpenReadStream());
                if (!thumbnailResponse.Success)
                {
                    response.SetFailureResponse(thumbnailResponse.Message, errorCode + " ," + thumbnailResponse.ErrorCode);
                    return response;
                }

                string nameOfSavedFile = await _imageRepository.SaveTempFile(uploadedFile, thumbnailResponse.ResponseData, currentAdGuid);
                response.ResponseData.Image = Convert.ToBase64String(thumbnailResponse.ResponseData);
                response.ResponseData.ImageFileName = nameOfSavedFile;

                response.SetSuccessResponse("files saved in temp folder");//magic string
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }
            return response;
        }

        [Authorize]
        public async Task<ResponseBase<string>> RemoveTempImage([FromQuery] Dictionary<string, string> userInput)
        {
            string errorCode = "AdApiController.RemoveTempImage";
            string FileNameToBeRemovedKey = "FileNameToBeRemoved";
            string defaultFileName = "__dddsss.jpg";

            string NewAdGuidKey = "NewAdGuid";
            string defaultGuid = new Guid().ToString();
            ResponseBase<string> response = new ResponseBase<string>();
            try
            {
                string fileNameToBeRemoved = ParameterExtractor.ExtractString(userInput, FileNameToBeRemovedKey, defaultFileName);
                Guid cuurendNewAdGuid = Guid.Parse(ParameterExtractor.ExtractString(userInput, NewAdGuidKey, new Guid().ToString()));

                if (fileNameToBeRemoved != defaultFileName)
                {
                    await _imageRepository.RemoveTempFile(fileNameToBeRemoved, cuurendNewAdGuid);
                }
                response.ResponseData = fileNameToBeRemoved;
                response.SetSuccessResponse("OK");
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }

            return response;
        }
        

            //TODO Remove this
        public ResponseBase<AdvertisementTransportation> GetTransportationAdDetail([FromBody] Guid adId)
        {
            IAdvertisementTransportationService transportationService = MyService.Inst.GetService<IAdvertisementTransportationService>();
            return transportationService.GetAdDetail(adId);
        }

        
        public ResponseBase<AdvertisementCommon> GetAdDetail([FromQuery][FromBody] AdDetailInfo adDetailInfo)
        {
            //TODO 3- find a way to use Advertisement classes instead of object in ResponseBase<AdvertisementBase>
            string errorCode = "AdApiController.GetAdDetail";

            ResponseBase<AdvertisementCommon> response=new ResponseBase<AdvertisementCommon>();
            IAdRepository adRepository = _repositoryContainer.GetAdRepository(adDetailInfo.CategoryId);
            AdvertisementCommon adDetail;
            try
            {
                adDetail = adRepository.GetAdDetail(adDetailInfo.AdId);
                
                if(adDetail.AdvertisementStatusId==3)//Magic number
                adDetail.AdvertisementImages= _imageRepository.GetAllAdvertisementImages(adDetailInfo.AdId);
                response.ResponseData = adDetail;
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }
            return response;
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

        [Authorize]
        public async Task<ResponseBase> MarkAd(Guid adGuid)
        {
            string errorCode = "AdApiController.MarkAd";
            ResponseBase response=new ResponseBase();
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                await _commonRepository.MarkAd(adGuid, user.Id);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }

            return response;
        }
    }

    public class UploadedImage
    {
        public string Image { get; set; }
        public string ImageFileName { get; set; }
        public string RequestIndex { get; set; }
    }
}
