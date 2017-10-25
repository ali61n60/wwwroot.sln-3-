using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Infrastructure.IOC;
using MvcMain.Infrastructure.Services;
using Newtonsoft.Json.Linq;
using RepositoryStd.Context.Helper;
using StructureMap.TypeRules;
using Microsoft.Extensions.DependencyInjection;


namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdApiController : Controller
    {
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
        public ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon([FromBody] Dictionary<string, string> userInput)
        {
            int startIndex = ParameterExtractor.ExtractStartIndex(userInput);
            int count = ParameterExtractor.ExtractCount(userInput);
            AdvertisementCommonService adCommonService =MyService.Inst.GetService<AdvertisementCommonService>();
            
            ResponseBase<AdvertisementCommon[]> response = adCommonService.GetAdvertisements(startIndex, count, userInput);
            setRequestIndex(userInput, response);
            return response;
        }
        
        public ResponseBase<AdvertisementTransportation> GetTransportationAdDetail([FromBody] Guid adId)
        {
            AdvertisementTransportationService advertisementTransportationService = new AdvertisementTransportationService();
            return advertisementTransportationService.GetAdDetail(adId);//TODO check for success parameter and if it is false show error to user
        }

       
        private void setRequestIndex(Dictionary<string, string> userInput, ResponseBase<AdvertisementCommon[]> response)
        {
            if (userInput.ContainsKey("RequestIndex"))
            {
                if (response.CustomDictionary != null)
                    response.CustomDictionary["RequestIndex"] = userInput["RequestIndex"];
                else
                    response.CustomDictionary = new Dictionary<string, string> { { "RequestIndex", userInput["RequestIndex"] } };
            }
        }
    }


}
