using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Razor.Internal;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Services;
using MvcMain.Components.Default.SearchAd;
using MvcMain.Infrastructure.IOC;
using MvcMain.Models;
using RepositoryStd.Context.Helper;
using RepositoryStd.Repository.Common;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//http://bitoftech.net/2014/06/01/token-based-authentication-asp-net-web-api-2-owin-asp-net-identity/

namespace MvcMain.Controllers
{
    public class HomeController : Controller
    {
        private AdApiController _adApiController;
        private readonly IRazorViewEngine _razorViewEngine;
        private readonly ITempDataProvider _tempDataProvider;
        private readonly IServiceProvider _serviceProvider;

       

        public HomeController(AdApiController adApiController,
            IRazorViewEngine razorViewEngine,
            ITempDataProvider tempDataProvider,
            IServiceProvider serviceProvider)
        {
            _adApiController = adApiController;
            _razorViewEngine = razorViewEngine;
            _tempDataProvider = tempDataProvider;
            _serviceProvider = serviceProvider;
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
        
        
        public ResponseBase<string> GetSearchCriteriaView([FromBody] Dictionary<string, string> userInput)
        {
            //TODO 3- put view's name in a container But it is hard to follow
            string errorCode = "HomeController/GetSearchCriteriaView";
            ResponseBase <string> response=new ResponseBase<string>();
            int categoryId = ParameterExtractor.ExtractInt(userInput, Category.CategoryIdKey, Category.CategoryIdDefault);
            //ViewComponentResult d= ViewComponent(AdViewContainer.GetAdDetailViewName(categoryId));
            
            SearchCriteriaDefault d = new SearchCriteriaDefault();
            
            string viewName = "~/Shared/Components/SearchCriteriaDefault/Default.chtml";

            try
            {
                var httpContext = new DefaultHttpContext {RequestServices = _serviceProvider};
                var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());

                using (var sw = new StringWriter())
                {
                    var viewResult = _razorViewEngine.FindView(actionContext, viewName, false);

                    //if (viewResult.View == null)
                    //{
                    //    throw new ArgumentNullException($"{viewName} does not match any available view");
                    //}

                    var viewDictionary = new ViewDataDictionary(
                        new EmptyModelMetadataProvider(),
                        new ModelStateDictionary())
                    {
                        //Model = model
                    };

                    ViewContext viewContext = new ViewContext(
                        actionContext,
                        viewResult.View,
                        viewDictionary,
                        new TempDataDictionary(actionContext.HttpContext, _tempDataProvider),
                        sw,
                        new HtmlHelperOptions()
                    );

                    ViewComponentContext context = new ViewComponentContext(
                        new ViewComponentDescriptor(),
                        new Dictionary<string, object>(),
                        HtmlEncoder.Default,
                        viewContext,
                        sw);
                    
                    
                     d.Invoke(viewName).Execute(context);
                      sw.Flush();
                    //response.ResponseData = ViewComponent(AdViewContainer.GetSearchAdPartialViewName(categoryId));
                    
                    //await viewResult.View.RenderAsync(viewContext);
                    response.ResponseData= sw.ToString();
                    response.SetSuccessResponse("OK");
                }
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }
            
            setRequestIndex(userInput, response);
            return response;
        }

        private readonly string requestIndexKey = "RequestIndex";
        private void setRequestIndex(Dictionary<string, string> userInput, ResponseBase<string> response)
        {
            if (userInput.ContainsKey(requestIndexKey))
            {
                if (response.CustomDictionary != null)
                    response.CustomDictionary[requestIndexKey] = userInput[requestIndexKey];
                else
                    response.CustomDictionary = new Dictionary<string, string> { { requestIndexKey, userInput[requestIndexKey] } };
            }
        }
    }
}
