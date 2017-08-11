using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Infrastructure.IOC;
using MvcMain.Infrastructure.ServicePolicy;
using MvcMain.Infrastructure.Services;


namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdApiController:Controller
    {
        private ServiceCommonPolicy _serviceCommonPolicy = new ServiceCommonPolicy();

        public JsonResult SayHello([FromQuery][FromBody] string name,int numberOfCalls)
        { 
            return Json(String.Format("Hello {0},Number is {1} current server time is: {2}", name,numberOfCalls, DateTime.Now.ToString()));
        }

        
        public ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon(
            [FromBody] Dictionary<string, string> userInput)
        {
            int startIndex = getInt("StartIndex",1,userInput);
            startIndex = _serviceCommonPolicy.StartIndexInRange(startIndex);
            int count = getInt("Count",5,userInput);
            count = _serviceCommonPolicy.CountInRange(count);
            int selectedCategoryId = getInt("CategoryId", 0, userInput);
            //Polymorphic dispatch of service call
            IAdvertisementService advertisementService = AdServiceDictionary.GetAdvertisementService(selectedCategoryId);
            ResponseBase<AdvertisementCommon[]> response = advertisementService.GetAdvertisements(startIndex, count, userInput);
            setRequestIndex(userInput,response);
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
        private void setRequestIndex(Dictionary<string, string> userInput, ResponseBase<AdvertisementCommon[]> response)
        {
            if (userInput.ContainsKey("RequestIndex"))
            {
                if (response.CustomDictionary != null)
                    response.CustomDictionary["RequestIndex"] = userInput["RequestIndex"];
                else
                {
                    response.CustomDictionary = new Dictionary<string, string>
                    {
                        {"RequestIndex", userInput["RequestIndex"]}
                    };
                }
            }
        }
    }

    
}
