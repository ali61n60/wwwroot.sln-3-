﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;
using ModelStd.IRepository;
using MvcMain.Infrastructure;
using RepositoryStd.Repository;
using RepositoryStd.TepmeratureRepository;

//TODO use Test to test repositories "Image Repository" and Transformation Repository 

namespace MvcMain.Controllers
{
    //TODO 0- Create a excell file for TODOs
    // TODO 1- use AsyncTask class for database check and update
    //Learn Action<T>
    //Learn more StructureMap IOC and manage localTables
    //Learn and use UNIT TEST, Integration test, Interaction test, UI test, Acceptance test, Approval test, Telerik test studio
    //Learn MOCK Framework
    //Learn and use UML
    //Learn Source code control programs
    //Learn ProtoBuffer
    //Learn multiple server balanceing load
    //Learn System.Runtime.Caching MemoryCache.Default.Add(...)
    //Learn Lazy<T> for using lazy loading
    //Learn Logging Log4net, NLOG, ...
    //Learn Func<Order, double> Expression<Func<Employee,bool>>
    //Learn Neti & webrtc


    //Create Advertisement in app service ***
    //TODO -2 Make repository method async
    //TODO -2 Use Array Adaptor to ViewGroupSingleAD
    //TODO -2 Make a manner to user input server ip address
    //TODO use Gateway pattern for web service classes
    //TODO Add setting section and update localdatabase option in it
    //TODO when updating database reprot the user how much the process has progressed
    //TODO Add ShowMarkedAd Activity
    //TODO In AdDetail check if the ad is marked user could understand it from a visual clue
    //TODO Add Report ad
    //TODO Add Sort By Number Of Visit
    //TODO Add category selection fragment for search AND for new ad
    //TODO Add new advertisement
    //TODO Add User Ads
    //TODO add capability for users to send messages to each other
    //TODO add expandableListView to Filter activity
    //TODO convert unnecessary activities into fragments

    //TODO Add notify me for specific items
    //TODO Add users credit
    //TODO ActivitySearchAd add "No More Result" when search returns 0 item
    //TODO ActivitySearchAd add Automatic Search when scrolled result
    //TODO ActivitySearchAd add Max number of result setter by user
    //TODO double-check local tableVersion storage and how to manage exception when updation
    //TODO design category selection view for new ad

    //TODO every call to data layer should check for exception and try to give user retry option

    //BUG messageShower call to server may be lost if after call current activity Die. Try to use a service instead of activity to call
    //server and manage MessageShower at service layer

    //BUG in category Selection activity when a parent is selected and button select all,with button deselect all is clicked the parent is still selected



    //TODO 1-Round-Robin DNS servers to distribute traffic
    //TODO 1- study about Best Web Api startegy and architecture to implement
    //TODO 1- decide to delete or not sharedPreferences content on app start. 
    //TODO 1-think of saving users search
    //TODO 1- Android Color https://material.io/color/#!/?view.left=0&view.right=1&primary.color=bee1ff&secondary.color=6ebbce
    //https://material.io/icons/ , https://www.materialpalette.com/icons
    //TODO 1- Buffer not changing database data and manage rare changes
    //TODO 1- Database tables must store int number for properties
    // convert int number to enums and string at class level
    //TODO 1- Create a page to have links to all api methods for test
    //TODO 1- Write unit test for everything
    //TODO 1 Design of typeScript ServerCaller must be better. make a generic servercaller class
    //TODO 1- verify user phone number

    //TODO 1- Create LetMeKnow Controller and View for users to register their need
    // gold user pays 3x, silver user pay 2x and get notifyed sooner -golden user in first 20 minutes,silver 20-40, normal user after 40 minutes
    // manage user credits (reduce and add credits and log credit activity
    // **** on Approving new or editted Ads by Admin insert it in ApprovedAd Table ****
    //make a link to letmeknow email to cancel user registration
    //Create SingleLetMeKnowModel and view component
    //Ask user time for recieving Sms ok
    //only send let me know messages to verifyed emails and smses

    //TODO 1- build AppIdentityDbContext ModelBuiler yourself instead of relying on inheritance

    //TODO 1- work on District,City,Province component

    //TODO 1- Create and Run SMS sending improve Android Send Sms App, Ask user Time for sms, send  a SMS of Important Error to admin(email sending errors)
    //TODO 1- Create Verify Ad Controller and View For Admin
    //TODO 1- work on view Ad Detail, use similar ads,...
    //TODO 1- add mangeMyAd page for users myAds, MarkedAds  work on MarkAd , share ad
    //TODO 1- work on users credits and money pay and ...
    //TODO 1- work on Edit AD by Ad owner
    //TODO 1- work on verifying users email and phone number

    //TODO 2- Break Repository classes into pieces based on search,newAd,LetMeKnow , ...
    //TODO 2- when import a class into another in typescript VS uses require. Make it ti use from
    //TODO 2- study about android app change when server changes
    //TODO 2- use Decorator pattern to log
    //TODO 2- study MVC book
    //TODO 2- study of multi-language website approach in MVC
    //TODO 2- study Task-Wait and async-await

    //TODO 3- work on the max number of images per Ad. for example decide it based on user
    //TODO 3- Make Response.Error an array and put all errors in it
    //TODO 3- study about rules to operate a web site and connect to bank  and register a company
    //TODO 3- improve database tables datatypse and 
    //TODO 3- use Decorator pattern to log


    //TODO 4- Add user Image and tooltip like yahoo site for LoginStatusViewComponent
    //TODO 4- How to send a message to user's Telegram 
    [Route("api/[controller]/[action]")]
    public class AdApiController : Controller, IAdvertisementCommonService
    {
        private readonly RepositoryContainer _repositoryContainer;
        private readonly ICommonRepository _commonRepository;
        private readonly IImageRepository _imageRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly TemperatureRepository _temperatureRepository;
        // RegistrationService registrationService;//TODO put it in Bootstrapper
        
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
            return Json(String.Format("Hello {0},Number is {1} current server time is: {2}", name, numberOfCalls, DateTime.Now.ToString(CultureInfo.InvariantCulture)));
        }

        public string WhatTimeIsIt()
        {
            return DateTime.Now.ToString(CultureInfo.InvariantCulture);
        }

        public string Ali()
        {
            return "REZANEJATI";
        }

        //TODO move this method to its controller
        public JsonResult InsertTemperature([FromQuery] double temperature, [FromQuery] double humidity, [FromQuery] double viewPoint)
        {
            string errorCode = "AdApiController/InsertTemperature";
            Temperature temperatureModel = new Temperature()
            {
                InsertDateTime = DateTime.Now,
                Degree = temperature,
                Humidity = humidity,
                ViewPoint = viewPoint
            };

            try
            {
                _temperatureRepository.Insert(temperatureModel);
            }
            catch (Exception ex)
            {
                return Json("Error " + ex.Message + " , " + errorCode);
            }
            return Json("OK");
        }

        public string WhatIsMyIpAddress()
        {
            return $"ip address={Request.HttpContext.Connection.RemoteIpAddress}, " +
                   $"port={Request.HttpContext.Connection.RemotePort}";
        }

        public async Task<ResponseBase> AddAdvertisement([FromBody] Dictionary<string, string> userInput)
        {
            string errorCode = "AdApiController.AddAdvertisement";
            ResponseBase response = new ResponseBase();
            int categoryId = Extractor.ExtractInt(userInput, Category.CategoryIdKey, Category.CategoryIdDefault);
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
            int categoryId = Extractor.ExtractInt(userInput, Category.CategoryIdKey, Category.CategoryIdDefault);
            IAdRepository adRepository = _repositoryContainer.GetAdRepository(categoryId);//polymorphyic dispatch
            try
            {
                response.ResponseData = adRepository.FindAdvertisementCommons(userInput).ToList();//get attributes 
                FillFirstImage(response.ResponseData);//get Images
                                                      //TODO create a column (has pictures) in advertisement table and check this filter at database 
                checkAndCorrectOnlyWithPicturesFilter(response, userInput);
                Dictionary<string, string> customDictionary = new Dictionary<string, string>();

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
                advertisementCommon.AdImages[0] =
                    _imageRepository.GetFirstAdvertisementImage(advertisementCommon.AdId);

            }
        }

        public void FillAllImages(AdvertisementCommon[] advertisementCommons)
        {
            throw new NotImplementedException();
        }

        public void FillAllImages(AdvertisementCommon advertisementCommon)
        {
            advertisementCommon.AdImages = _imageRepository.GetAllAdvertisementImages(advertisementCommon.AdId);
        }

        private void checkAndCorrectOnlyWithPicturesFilter(ResponseBase<IList<AdvertisementCommon>> response, Dictionary<string, string> userInput)
        {
            if (userInput.ContainsKey(onlyWithPicturesKey) && userInput[onlyWithPicturesKey] == "True") // OnlyWithPictures filter set
            {
                foreach (AdvertisementCommon advertisementCommon in response.ResponseData)
                {
                    if (advertisementCommon.AdImages[0] == null)
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

        public ResponseBase SaveAdImages(AdvertisementCommon advertisementCommon)
        {
            string errorCode = "AdApiController.SaveAdImages";
            ResponseBase responseBase = new ResponseBase();
            try
            {
                if (advertisementCommon.AdImages != null)
                {
                    _imageRepository.SaveImages(advertisementCommon.AdId, advertisementCommon.AdImages);
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
                ContentDispositionHeaderValue.Parse(uploadedFile.ContentDisposition).FileName.Trim('"');

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
            ResponseBase<string> response = new ResponseBase<string>();
            try
            {
                string fileNameToBeRemoved = Extractor.ExtractString(userInput, FileNameToBeRemovedKey, defaultFileName);
                Guid cuurendNewAdGuid = Guid.Parse(Extractor.ExtractString(userInput, NewAdGuidKey, new Guid().ToString()));

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

        public ResponseBase<AdvertisementCommon> GetAdDetail([FromBody] AdDetailInfo adDetailInfo)
        {
            string errorCode = "AdApiController.GetAdDetail";

            ResponseBase<AdvertisementCommon> response = new ResponseBase<AdvertisementCommon>();
            IAdRepository adRepository = _repositoryContainer.GetAdRepository(adDetailInfo.CategoryId);
            Guid adGuid=Guid.Parse(adDetailInfo.AdGuid);
            AdvertisementCommon adDetail;
            try
            {
                adDetail = adRepository.GetAdDetail(adGuid);
                _commonRepository.IncrementNumberOfVisit(adGuid);

                if (adDetail.AdStatus == Advertisement.GetAdStatusString(AdStatus.Approved))
                    adDetail.AdImages = _imageRepository.GetAllAdvertisementImages(adGuid);
                response.ResponseData = adDetail;
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
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
            ResponseBase response = new ResponseBase();
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                await _commonRepository.MarkAd(adGuid, user.Id);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
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
