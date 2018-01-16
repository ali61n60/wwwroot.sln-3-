﻿using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;
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
        private readonly UserManager<AppUser> _userManager;

        public AdTransportationApiController()
        {
            _transportaionRepository =MyService.Inst.GetService<ITransportaionRepository>();
            _advertisementTransportationRepository = MyService.Inst.GetService<IRepository<AdvertisementTransportation>>();
            _advertisementCommonService = MyService.Inst.GetService<IAdvertisementCommonService>();
            // registrationService = new RegistrationService();
            _userManager = MyService.Inst.GetService<UserManager<AppUser>>();
        }
        
       
        public ResponseBase<AdvertisementTransportation> GetAdDetail(Guid adId)
        {
            string errorCode = "AdTransportationApiController.GetAdDetail";
            ResponseBase<AdvertisementTransportation> responseBase = new ResponseBase<AdvertisementTransportation>();
            try
            {
                responseBase.ResponseData = _advertisementTransportationRepository.FindBy(adId);
                if (responseBase.ResponseData != null)
                {
                    _advertisementCommonService.IncrementNumberOfVisit(adId);
                    _advertisementCommonService.FillAllImages(responseBase.ResponseData);
                    responseBase.SetSuccessResponse();
                }
                else
                    responseBase.SetFailureResponse("repository returned NULL", errorCode);
            }
            catch (Exception ex)
            {
                responseBase.SetFailureResponse(ex.Message, errorCode);
            }
            return responseBase;
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
        

       public ResponseBase<int> GetServerDataVersion()
        {
            ResponseBase<int> response = new ResponseBase<int>
            {
                ResponseData = 2 //TODO create an xml-base file and read this value from xml file
            };
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<IEnumerable<Brand>> GetAllTransportationBrands()
        {
            string errorCode = "AdTransportationApiController.GetAllTransportationBrands";
            ResponseBase<IEnumerable<Brand>> response = new ResponseBase<IEnumerable<Brand>>();
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

        public ResponseBase<IEnumerable<CarModel>> GetAllTransportationModels()
        {
            string errorCode = "AdTransportationApiController.GetAllTransportationModels";
            ResponseBase<IEnumerable<CarModel>> response = new ResponseBase<IEnumerable<CarModel>>();
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
