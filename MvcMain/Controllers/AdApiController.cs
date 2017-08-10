using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Infrastructure.ServicePolicy;


namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdApiController:Controller
    {
        
        public JsonResult SayHello([FromQuery][FromBody] string name,int numberOfCalls)
        { 
            return Json(String.Format("Hello {0},Number is {1} current server time is: {2}", name,numberOfCalls, DateTime.Now.ToString()));
        }



        private ServiceCommonPolicy _serviceCommonPolicy = new ServiceCommonPolicy();
        public ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon(
            [FromBody] Dictionary<string, string> userInput)
        {
            int startIndex = getInt("StartIndex",1,userInput);
            startIndex = _serviceCommonPolicy.StartIndexInRange(startIndex);
            int count = getInt("Count",5,userInput);
            count = _serviceCommonPolicy.CountInRange(count);
            int selectedCategoryId = getInt("CategoryId", 0, userInput);
            //Polymorphic dispatch of service call
            //IAdvertisementService advertisementService = AdServiceDictionary.GetAdvertisementService(selectedCategoryId);
            //_response = advertisementService.GetAdvertisements(startIndex, count, userInput);
            //setRequestIndex(userInput);
            //return _response;










            ResponseBase<AdvertisementCommon[]> response=new ResponseBase<AdvertisementCommon[]>();
            
            //TODO Get data from database(repository) and put it in response.ResponseData
            string resStr = "developmentPhase";
            if(userInput!=null)
                foreach (KeyValuePair<string, string> keyValuePair in userInput)
                {
                    resStr +=" "+ keyValuePair.Key + "=" + keyValuePair.Value;
                }
            response.SetSuccessResponse(resStr);
            response.ResponseData = null;
            return response;
        }

       

        private int getInt(string key,int defaultValue, Dictionary<string, string> userInput)
        {
            int returnValue = defaultValue;
            if (userInput.ContainsKey(key))
            {
                int.TryParse(userInput[key], out returnValue);
            }
            return returnValue;
        }
    }

    
}
