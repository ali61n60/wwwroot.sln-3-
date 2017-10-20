using System;
using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Advertisements;
using ModelStd.IRepository;
using ModelStd.Services;
using RepositoryStd.QueryPattern.BaseQuery;


namespace MvcMain.Infrastructure.Services
{
     public class AdvertisementTransportationService :IAdvertisementService// IAdvertisementTransportationService, IAdvertisementService, IServiceCommon
    {
        ResponseBase<AdvertisementCommon[]> _response;
        private readonly IRepository<AdvertisementTransportation> _advertisementTransportationRepository;
        private readonly ITransportaionRepository _transportaionRepository;
        private readonly IAdvertisementCommonService _advertisementCommonService;
        //RegistrationService registrationService;//TODO put it in Bootstrapper

        public AdvertisementTransportationService
            (IRepository<AdvertisementTransportation> advertisementTransportationRepository,
            IAdvertisementCommonService advertisementCommonService,ITransportaionRepository transportaionRepository)
        {
            _advertisementTransportationRepository = advertisementTransportationRepository;
            _advertisementCommonService = advertisementCommonService;
            _transportaionRepository = transportaionRepository;
        //    registrationService = new RegistrationService();
        }

        private IImageRepository im;
        public AdvertisementTransportationService()
        {
            _advertisementTransportationRepository =
                AppServiceProvider.Instance.GetService<IRepository<AdvertisementTransportation>>();

            _advertisementCommonService = AppServiceProvider.Instance.GetService<IAdvertisementCommonService>();
            _transportaionRepository = AppServiceProvider.Instance.GetService<ITransportaionRepository>();
           
           // registrationService = new RegistrationService();
        }

        //Called for getting search result
        public ResponseBase<AdvertisementCommon[]> GetAdvertisements(int startIndex, int count, Dictionary<string, string> userInput)
        {
            string errorCode = "AdvertisementTransportationService.GetAdvertisements";
            BaseQueryAdTransportation baseQueryAdTransportation = new BaseQueryAdTransportation(userInput);
            _response = new ResponseBase<AdvertisementCommon[]>();
            //try
            //{
            //    AdvertisementTransportation[] advertisementTransportation =
            //        _advertisementTransportationRepository.FindBy(baseQueryAdTransportation, startIndex, count).ToArray();//get attributes 
            //    AdvertisementCommon[] advertisementCommons = getAdvertisementCommons(advertisementTransportation);
            //    _advertisementCommonService.FillFirstImage(advertisementCommons);//get Images
            //    _response.ResponseData = advertisementCommons;
            //    _response.SetSuccessResponse();
            //}
            //catch (Exception ex)
            //{
            //    _response.ResponseData = null;
            //    _response.SetFailureResponse(ex.Message, errorCode);
            //}
            return _response;
        }

        public ResponseBase<AdvertisementTransportation> GetAdDetail(Guid adId)
        {
            
            ResponseBase<AdvertisementTransportation> responseBase=new ResponseBase<AdvertisementTransportation>();
            //TODO check for error
            responseBase.ResponseData = _advertisementTransportationRepository.FindBy(adId);
            responseBase.SetSuccessResponse();
            return responseBase;
        }

        private AdvertisementCommon[] getAdvertisementCommons(AdvertisementTransportation[] advertisementTransportations)
        {
            AdvertisementCommon[] advertisementCommons = new AdvertisementCommon[advertisementTransportations.Length];
            for (int i = 0; i < advertisementTransportations.Length; i++)
            {
                advertisementCommons[i] = advertisementTransportations[i].AdvertisementCommon;
            }
            return advertisementCommons;
        }

        //public ResponseBase RemoveAd(AdvertisementCommon advertisementCommon)
        //{
        //    string errorCode = "AdvertisementTransportationService.RemoveAd";
        //    AdvertisementTransportation advertisementTransportation = new AdvertisementTransportation
        //    {
        //        AdvertisementCommon = advertisementCommon
        //    };

        //    ResponseBase response = new ResponseBase();
        //    try
        //    {
        //        _advertisementTransportationRepository.Remove(advertisementTransportation);
        //        response.SetSuccessResponse();
        //    }
        //    catch (Exception ex)
        //    {
        //        response.SetFailureResponse(ex.Message, errorCode);
        //    }

        //    return response;
        //}

        ////get custom and common attributes
        ////Refactor this method

        //public ResponseBase<AdvertisementTransportation> GetAdvertisementTransportation(Guid AdvertisementGuid)
        //{
        //    string errorCode = "AdvertisementTransportationService.GetAdvertisementsTransportation";
        //    ResponseBase<AdvertisementTransportation> response = new ResponseBase<AdvertisementTransportation>();

        //    try
        //    {
        //        response.ResponseData =
        //            _advertisementTransportationRepository.FindBy(AdvertisementGuid);//get Ad attributes
        //        _advertisementCommonService.FillAllImages(response.ResponseData.AdvertisementCommon);
        //        _advertisementTransportationRepository.IncrementNumberOfVisit(AdvertisementGuid);
        //        response.Success = true;
        //        response.Message = "OK";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.SetFailureResponse(ex.Message, errorCode);
        //        response.Success = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}


        //public ResponseBase AddNewAdvertisementTransportation(AdvertisementTransportation advertisementTransportation,
        //                                                         string userName, string password, bool userPassIsEncrypted)
        //{
        //    string errorCode = "AdvertisementTransportationService.AddNewAdvertisementTransportation";
        //    ResponseBase response = new ResponseBase();

        //    if (userPassIsEncrypted)
        //    {
        //        userName = CryptoService.Decrypt(userName);
        //        password = CryptoService.Decrypt(password);
        //    }
        //    ResponseBase userPassResponseBase = registrationService.ValidateUser(userName, password);
        //    if (!userPassResponseBase.Success)//error in username/password
        //    {
        //        response.SetFailureResponse(userPassResponseBase.Message, errorCode + ", " + userPassResponseBase.ErrorCode);
        //        return response;
        //    }
        //    if (!InputParametersOk(advertisementTransportation))
        //    {
        //        response.SetFailureResponse("Input Parameters Error", errorCode);
        //    }
        //    Guid userGuid = registrationService.GetUserId(userName);
        //    return AddNewAdvertisementTransportation(advertisementTransportation, userGuid);


        //}

        //private bool InputParametersOk(AdvertisementTransportation advertisementTransportation)
        //{
        //    //TODO check input data in AdTransportation and return false if error
        //    return true;
        //}

        //private ResponseBase AddNewAdvertisementTransportation(AdvertisementTransportation advertisementTransportation, Guid userGuid)
        //{
        //    string errorCode = "AdvertisementTransportationService.AddNewAdvertisementTransportation";
        //    advertisementTransportation.AdvertisementCommon.AdvertisementStatusId = 1;//submitted
        //    advertisementTransportation.AdvertisementCommon.AdvertisementId = Guid.NewGuid();
        //    advertisementTransportation.AdvertisementCommon.AdvertisementTime = DateTime.Now;
        //    advertisementTransportation.AdvertisementCommon.UserId = userGuid;
        //    ResponseBase response = new ResponseBase();
        //    try
        //    {
        //        //TODO why first insert Ad images and then attributes are saved in database????
        //        response = _advertisementCommonService.SaveAdImages(advertisementTransportation.AdvertisementCommon);//save images
        //        if (!response.Success)
        //        {
        //            return response;
        //        }
        //        _advertisementTransportationRepository.Add(advertisementTransportation);//save attributes
        //        response.SetSuccessResponse();
        //    }
        //    catch (Exception)
        //    {
        //        //TODO images saved and error in database==> delete images 
        //        response.SetFailureResponse("Could not add advertisementTransportation in repository", errorCode);
        //    }
        //    return response;
        //}

        //public ResponseBase EditAdvertisementTransportation(AdvertisementTransportation advertisementTransportation)
        //{
        //    string errorCode = "AdvertisementTransportationService.EditAdvertisementTransportation";
        //    ResponseBase response = new ResponseBase();
        //    try
        //    {
        //        _advertisementTransportationRepository.Save(advertisementTransportation);
        //        response.SetSuccessResponse();
        //    }
        //    catch (Exception ex)
        //    {
        //        response.SetFailureResponse(ex.Message, errorCode);
        //    }
        //    return response;
        //}

        //public ResponseBase<TransportationBrand[]> GetAllTransportationBrands()
        //{
        //    string errorCode = "AdvertisementTransportationService.GetAllTransportationBrands";
        //    ResponseBase<TransportationBrand[]> response = new ResponseBase<TransportationBrand[]>();
        //    try
        //    {
        //        response.ResponseData = _transportaionRepository.GetAllBrands();
        //        response.SetSuccessResponse();
        //    }
        //    catch (Exception ex)
        //    {
        //        response.ResponseData = null;
        //        response.SetFailureResponse(ex.Message, errorCode);
        //    }
        //    return response;
        //}

        //public ResponseBase<TransportationModel[]> GetAllTransportationModels()
        //{
        //    string errorCode = "AdvertisementTransportationService.GetAllTransportationModels";
        //    ResponseBase<TransportationModel[]> response = new ResponseBase<TransportationModel[]>();
        //    try
        //    {
        //        response.ResponseData = _transportaionRepository.GetAllModels();
        //        response.SetSuccessResponse();
        //    }
        //    catch (Exception ex)
        //    {
        //        response.ResponseData = null;
        //        response.SetFailureResponse(ex.Message, errorCode);
        //    }
        //    return response;
        //}


        //public ResponseBase<Vehicle[]> GetAllVehicles()
        //{
        //    string errorCode = "AdvertisementTransportationServic.GetAllVehicles";
        //    ITransportaionRepository iTransportaionRepository = Bootstrapper.container.GetInstance<ITransportaionRepository>();
        //    ResponseBase<Vehicle[]> response = new ResponseBase<Vehicle[]>();
        //    try
        //    {
        //        response.ResponseData = iTransportaionRepository.GetAllVehicles();
        //        response.SetSuccessResponse("OK");
        //    }
        //    catch (Exception ex)
        //    {
        //        response.ResponseData = null;
        //        response.SetFailureResponse(ex.Message, errorCode);
        //    }
        //    return response;
        //}

        //public ResponseBase<int> GetServerDataVersion()
        //{
        //    ResponseBase<int> response = new ResponseBase<int>
        //    {
        //        ResponseData = 2 //TODO create an xml-base file and read this value from xml file
        //    };
        //    response.SetSuccessResponse();
        //    return response;
        //}
    }

    
}
