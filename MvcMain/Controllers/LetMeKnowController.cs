using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using ModelStd.Services;
using MvcMain.Infrastructure.IOC;
using MvcMain.Utilities;

namespace MvcMain.Controllers
{
    public class LetMeKnowController:Controller
    {
        private readonly IViewRenderService _viewRenderService;

        public LetMeKnowController(IViewRenderService viewRenderService)
        {
            _viewRenderService = viewRenderService;
        }

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

        public async Task<IActionResult> LetMeKnowTransformation()
        {
            return View("LetMeKnowTransformation");
        }

        public async Task<IActionResult> LetMeKnowDefault()
        {
            return View("LetMeKnowDefault");
        }
        
        public async Task<ResponseBase<string>> GetLetMeKnowPartialView([FromBody] Dictionary<string, string> userInput)
        {
            string errorCode = "LetMeKnowController/GetLetMeKnowPartialView";
            ResponseBase<string> response = new ResponseBase<string>();
            int categoryId = Extractor.ExtractInt(userInput, Category.CategoryIdKey, Category.CategoryIdDefault);
            string viewName = AdViewContainer.GetLetMeKnowPartialViewName(categoryId);
            try
            {
                response.ResponseData = await _viewRenderService.RenderToStringAsync(viewName, null);
                response.SetSuccessResponse("OK", userInput);
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode, userInput);
            }

            return response;
        }
    }
}
