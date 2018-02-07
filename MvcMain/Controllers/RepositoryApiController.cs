using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class RepositoryApiController:Controller
    {
        public ResponseBase<int> GetServerMainDataVersion()
        {
            ResponseBase<int> response = new ResponseBase<int>
            {
                ResponseData = 5 //TODO create an xml-base file and read this value from xml file
            };
            response.SetSuccessResponse();
            return response;
        }
    }
}
