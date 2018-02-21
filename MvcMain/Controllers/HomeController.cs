using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Services;
using MvcMain.Infrastructure.IOC;
using MvcMain.Utilities;


// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//http://bitoftech.net/2014/06/01/token-based-authentication-asp-net-web-api-2-owin-asp-net-identity/

namespace MvcMain.Controllers
{
    public class HomeController : Controller
    {
        private AdApiController _adApiController;
        private readonly IViewRenderService _viewRenderService;
        
        public HomeController(AdApiController adApiController, IViewRenderService viewRenderService)
        {
            _adApiController = adApiController;
            _viewRenderService = viewRenderService;
        }
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> AdDetail(AdDetailInfo adDetailInfo)
        {
           ResponseBase<AdvertisementCommon> response=_adApiController.GetAdDetail(adDetailInfo);

            if(response.Success)
            {
                return View(AdViewContainer.GetAdDetailViewName(adDetailInfo.CategoryId), response.ResponseData);
            }
            else
            {
                //TODO 3- show error to user
                return View("Index");
            }
        }

        public async Task<IActionResult> SearchCriteriaDefault()
        {
            return View("SearchCriteriaDefault");
        }

        public async Task<IActionResult> SearchCriteriaTransformation()
        {
            return View("SearchCriteriaTransformation");
        }


        public async Task<ResponseBase<string>> GetSearchCriteriaView([FromBody] Dictionary<string, string> userInput)
        {
           string errorCode = "HomeController/GetSearchCriteriaView";
            ResponseBase <string> response=new ResponseBase<string>();
            int categoryId = Extractor.ExtractInt(userInput, Category.CategoryIdKey, Category.CategoryIdDefault);
            
            string viewName =AdViewContainer.GetSearchAdPartialViewName(categoryId);
            
            try
            {
                response.ResponseData =await  _viewRenderService.RenderToStringAsync(viewName, null);
                response.SetSuccessResponse("OK",userInput);
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode, userInput);
            }
            
            return response;
        }
    }
}
