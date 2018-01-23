using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RepositoryStd.Context.Helper;
using RepositoryStd.Repository.Common;

namespace MvcMain.Controllers
{
    //TODO enable users to register for items to be informed when a new ad meets user requirements
    public class LetMeKnowController:Controller
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> Confirm()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetLetMeKnowPartialView([FromQuery] Dictionary<string, string> userInput)
        {
            int categoryId = ParameterExtractor.ExtractInt(userInput, AdvertisementCommonRepository.CategoryIdKey, AdvertisementCommonRepository.CategoryIdDefault);
            switch (categoryId)
            {
                case 100:
                    return ViewComponent("LetMeKnowTransformation");
                default:
                    return ViewComponent("LetMeKnowDefault");
            }
        }
    }
}
