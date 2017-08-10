using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class RepositoryApiController:Controller
    {
        public ResponseBase<int> GetMainServerDataVersion()
        {
            string errorCode = "RepositoryService.GetMainServerDataVersion";
            ResponseBase<int> response = new ResponseBase<int>
            {
                ResponseData = 4 //TODO create an xml-base file and read this value from xml file
            };
            response.SetSuccessResponse();
            return response;
        }
    }
}
