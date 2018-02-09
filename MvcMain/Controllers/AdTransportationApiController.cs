using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using ModelStd.Services;
using MvcMain.Infrastructure.Services;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdTransportationApiController : Controller, IAdvertisementTransportationService
    {
        private readonly ITransportaionRepository _transportaionRepository;
        private readonly IRepository<AdvertisementTransportation> _advertisementTransportationRepository;
        private readonly IAdvertisementCommonService _advertisementCommonService;

        public AdTransportationApiController()
        {
            _transportaionRepository = MyService.Inst.GetService<ITransportaionRepository>();
            _advertisementTransportationRepository = MyService.Inst.GetService<IRepository<AdvertisementTransportation>>();
            _advertisementCommonService = MyService.Inst.GetService<IAdvertisementCommonService>();
        }
        
        public ResponseBase<int> GetServerDataVersion()
        {
            ResponseBase<int> response = new ResponseBase<int>
            {
                ResponseData = 1 //TODO create an xml-base file and read this value from xml file
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
