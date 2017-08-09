using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AdApiController:Controller
    {
        
        public JsonResult SayHello([FromQuery][FromBody] string name,int numberOfCalls)
        { 
            return Json(String.Format("Hello {0},Number is {1} current server time is: {2}", name,numberOfCalls, DateTime.Now.ToString()));
        }

       
        public ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon([FromBody] MyParam myParam)
        {
            ResponseBase<AdvertisementCommon[]> response=new ResponseBase<AdvertisementCommon[]>();
            //TODO Get data from database(repository) and put it in response.ResponseData
            string resStr = "developmentPhase" + myParam?.StartIndex + " , " + myParam?.Count;
            foreach (KeyValuePair<string, string> keyValuePair in myParam?.UserInput)
            {
                resStr += keyValuePair.Key + " , " + keyValuePair.Value;
            }
            response.SetSuccessResponse(resStr);
            response.ResponseData = null;

            return response;
        }
    }

    public class MyParam
    {
        public int StartIndex { get; set; }
        public int Count { get; set; }
        public Dictionary<string,string> UserInput { get; set; }
    }
}
