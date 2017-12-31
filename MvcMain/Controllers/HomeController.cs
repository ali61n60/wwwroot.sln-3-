using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Components.NewAd;
using MvcMain.Infrastructure.Services;
using MvcMain.Models;
using RepositoryStd.Context.Helper;
using RepositoryStd.Repository.Common;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//http://bitoftech.net/2014/06/01/token-based-authentication-asp-net-web-api-2-owin-asp-net-identity/

namespace MvcMain.Controllers
{
    public class HomeController : Controller
    {
        
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> AdDetail(AdDetailInfo adDetailInfo)
        {
            AdApiController adApiController=new AdApiController();
            switch (adDetailInfo.CategoryId)
            {
                case 100:
                    ResponseBase<AdvertisementTransportation> response = adApiController.GetTransportationAdDetail(adDetailInfo.AdId);
                    if (response.Success)
                        return View("AdDetail/AdDetailTransportation", response.ResponseData);
                    else
                        //TODO show error
                        return null;
                default:
                    return View("AdDetail/AdDetailDefault", adDetailInfo);
            }
        }

        [Authorize]
        public async Task<IActionResult> NewAd()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetNewAdPartialView([FromQuery] Dictionary<string, string> userInput)
        {
            int categoryId = ParameterExtractor.ExtractInt(userInput,AdvertisementCommonRepository.CategoryIdKey,AdvertisementCommonRepository.CategoryIdDefault);
            switch (categoryId)
            {
                case 100:
                    return ViewComponent("NewAdTransformation");
                    default:
                        return ViewComponent("NewAdDefault");
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
