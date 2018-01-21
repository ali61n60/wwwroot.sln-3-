using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RepositoryStd.Context.Helper;
using RepositoryStd.Repository.Common;

namespace MvcMain.Controllers
{
    public class NewAdController : Controller
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            Guid currentNewAdGuid = Guid.NewGuid();
            return View(currentNewAdGuid);
        }

        [Authorize]
        public async Task<IActionResult> Confirm()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetNewAdPartialView([FromQuery] Dictionary<string, string> userInput)
        {
            int categoryId = ParameterExtractor.ExtractInt(userInput, AdvertisementCommonRepository.CategoryIdKey, AdvertisementCommonRepository.CategoryIdDefault);
            switch (categoryId)
            {
                case 100:
                    return ViewComponent("NewAdTransformation");
                default:
                    return ViewComponent("NewAdDefault");
            }
        }


    }
}
