using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Advertisements;
using ModelStd.Advertisements.Transportation;
using ModelStd.IRepository;
using ModelStd.Services;
using MvcMain.Infrastructure.Services;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdTransportationApiController:Controller, IAdvertisementTransportationService
    {
        private readonly ITransportaionRepository _transportaionRepository;
        private readonly IRepository<AdvertisementTransportation> _advertisementTransportationRepository;

        private readonly IAdvertisementCommonService _advertisementCommonService;
        //RegistrationService registrationService;//TODO put it in Bootstrapper
        private IImageRepository im;

        public AdTransportationApiController()
        {
            _transportaionRepository =MyService.Inst.GetService<ITransportaionRepository>();
            _advertisementTransportationRepository = MyService.Inst.GetService<IRepository<AdvertisementTransportation>>();
            _advertisementCommonService = MyService.Inst.GetService<IAdvertisementCommonService>();
            // registrationService = new RegistrationService();
        }


        

       
        public ResponseBase<AdvertisementTransportation> GetAdDetail(Guid adId)
        {
            string errorCode = "AdvertisementTransportationService.GetAdDetail";

            ResponseBase<AdvertisementTransportation> responseBase = new ResponseBase<AdvertisementTransportation>();
            try
            {
                responseBase.ResponseData = _advertisementTransportationRepository.FindBy(adId);
                if (responseBase.ResponseData != null)
                {
                    _advertisementCommonService.IncrementNumberOfVisit(adId);
                    _advertisementCommonService.FillAllImages(responseBase.ResponseData.AdvertisementCommon);
                    responseBase.SetSuccessResponse();
                }
                else
                {
                    responseBase.SetFailureResponse("repository returned NULL", errorCode);
                }
            }
            catch (Exception ex)
            {
                responseBase.SetFailureResponse(ex.Message, errorCode);
            }

            return responseBase;
        }

        public ResponseBase AddNewAdvertisementTransportation(AdvertisementTransportation advertisementTransportation)
        {
            //string errorCode = "AdvertisementTransportationService.AddNewAdvertisementTransportation";
            //ResponseBase response = new ResponseBase();

            //if (userPassIsEncrypted)
            //{
            //    userName = CryptoService.Decrypt(userName);
            //    password = CryptoService.Decrypt(password);
            //}
            //ResponseBase userPassResponseBase = registrationService.ValidateUser(userName, password);
            //if (!userPassResponseBase.Success)//error in username/password
            //{
            //    response.SetFailureResponse(userPassResponseBase.Message, errorCode + ", " + userPassResponseBase.ErrorCode);
            //    return response;
            //}
            //if (!InputParametersOk(advertisementTransportation))
            //{
            //    response.SetFailureResponse("Input Parameters Error", errorCode);
            //}
            //Guid userGuid = registrationService.GetUserId(userName);
            //return AddNewAdvertisementTransportation(advertisementTransportation, userGuid);
            return null;

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


















        public ResponseBase<int> GetServerDataVersion()
        {
            ResponseBase<int> response = new ResponseBase<int>
            {
                ResponseData = 2 //TODO create an xml-base file and read this value from xml file
            };
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<TransportationBrand[]> GetAllTransportationBrands()
        {
            string errorCode = "AdTransportationApiController.GetAllTransportationBrands";
            ResponseBase<TransportationBrand[]> response = new ResponseBase<TransportationBrand[]>();
            try
            {
                response.ResponseData = _transportaionRepository.GetAllBrands();
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.ResponseData = null;
                response.SetFailureResponse(ex.Message, errorCode);
            }
            return response;
        }

        public ResponseBase<TransportationModel[]> GetAllTransportationModels()
        {
            string errorCode = "AdTransportationApiController.GetAllTransportationModels";
            ResponseBase<TransportationModel[]> response = new ResponseBase<TransportationModel[]>();
            try
            {
                response.ResponseData = _transportaionRepository.GetAllModels();
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.ResponseData = null;
                response.SetFailureResponse(ex.Message, errorCode);
            }
            return response;
        }
    }
}
