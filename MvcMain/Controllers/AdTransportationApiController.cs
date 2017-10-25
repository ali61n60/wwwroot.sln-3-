using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Advertisements.Transportation;
using ModelStd.IRepository;
using ModelStd.Services;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdTransportationApiController:Controller
    {
        private readonly ITransportaionRepository _transportaionRepository;

        public AdTransportationApiController()
        {
            _transportaionRepository =MyService.Inst.GetService<ITransportaionRepository>();
           
        }

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
