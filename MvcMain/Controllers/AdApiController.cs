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
        [HttpGet]
        public JsonResult SayHello([FromQuery][FromBody] string name,int numberOfCalls)
        { 
            return Json(String.Format("Hello {0},Number is {1} current server time is: {2}", name,numberOfCalls, DateTime.Now.ToString()));
        }

        [HttpGet]
        public ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon([FromQuery] int startIndex,
                                                                          [FromQuery] int count,
                                                                          [FromQuery] Dictionary<string, string> userInput)
        {
            ResponseBase<AdvertisementCommon[]> response=new ResponseBase<AdvertisementCommon[]>();
            //TODO Get data from database(repository) and put it in response.ResponseData
            response.SetSuccessResponse("developmentPhase");
            response.ResponseData = null;

            return response;
        }
    }
}
