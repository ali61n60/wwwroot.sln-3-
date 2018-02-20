using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using ModelStd.Services;
using MvcMain.Infrastructure.IOC;
using MvcMain.Utilities;
using RepositoryStd.Context.Helper;
using RepositoryStd.Repository.Common;

namespace MvcMain.Controllers
{
    public class NewAdController : Controller
    {
        private readonly IViewRenderService _viewRenderService;
        public NewAdController(IViewRenderService viewRenderService)
        {
            _viewRenderService = viewRenderService;
        }

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

        public IActionResult NewAdDefault()
        {
            return View("NewAdDefault");
        }

        public IActionResult NewAdTransformation()
        {
            return View("NewAdTransformation");
        }

        public async Task<ResponseBase<string>> GetNewAdPartialView([FromBody] Dictionary<string, string> userInput)
        {
            string errorCode = "NewAdController/GetNewAdPartialView";
            ResponseBase<string> response = new ResponseBase<string>();
            int categoryId = Extractor.ExtractInt(userInput, Category.CategoryIdKey, Category.CategoryIdDefault);
            string viewName = AdViewContainer.GetNewAdPartialViewName(categoryId);
            try
            {
                response.ResponseData = await _viewRenderService.RenderToStringAsync(viewName, null);
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
