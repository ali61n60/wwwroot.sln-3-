using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.IRepository;
using ModelStd.Services;
using MvcMain.Infrastructure.IOC;
using MvcMain.Models;
using RepositoryStd.Context.Helper;
using RepositoryStd.Repository;
using RepositoryStd.Repository.Common;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//http://bitoftech.net/2014/06/01/token-based-authentication-asp-net-web-api-2-owin-asp-net-identity/

namespace MvcMain.Controllers
{
    public class HomeController : Controller
    {
        private AdApiController _adApiController;
        public HomeController(AdApiController adApiController)
        {
            _adApiController = adApiController;
        }
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> AdDetail(AdDetailInfo adDetailInfo)
        {
           ResponseBase<object> response=_adApiController.GetAdDetail(adDetailInfo);

            if(response.Success)
            {
                return View(AdDetailViewContainer.GetViewName(adDetailInfo.CategoryId), response.ResponseData);
            }
            else
            {
                //TODO 3- show error to user
                return View("Index");
            }
        }
        
        [HttpGet]
        public IActionResult GetSearchCriteriaView([FromQuery] Dictionary<string, string> userInput)
        {
            int categoryId = ParameterExtractor.ExtractInt(userInput, AdvertisementCommonRepository.CategoryIdKey, AdvertisementCommonRepository.CategoryIdDefault);
            switch (categoryId)
            {
                case 100:
                    return ViewComponent("SearchCriteriaTransformation");
                default:
                    return ViewComponent("SearchCriteriaDefault");
            }
        }
    }
}
