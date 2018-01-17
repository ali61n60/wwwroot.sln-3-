using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace MvcMain.Controllers
{
    public class UserController:Controller
    {
        private readonly UserAdApiController _userAdApiController;
        
        public UserController(UserAdApiController userAdApiController)
        {
            _userAdApiController = userAdApiController;
        }

        [Authorize]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> UserAds()
        {
            _userAdApiController.ControllerContext.HttpContext = HttpContext;
            ResponseBase<IEnumerable<AdvertisementCommon>> response =await _userAdApiController.GetUserAds();
            if (response.Success)
            {
                return View(response.ResponseData);
            }
            else
            {
                ViewData["Message"] = $"message={response.Message}, errorCode={response.ErrorCode}";
                return View();
            }
        }
        

        [Authorize]
        public async Task<IActionResult> UpdateAd(Guid adGuid)
        {
            _userAdApiController.ControllerContext.HttpContext = HttpContext;
            ResponseBase response =await _userAdApiController.UpdateAd(adGuid);
            if (response.Success)
            {
                ViewData["Message"] = "آگهی بروزرسانی شد";
                return View("UserAds");
            }
            else
            {
                //TODO log error
                ViewData["Message"] = $"{response.Message} , {response.ErrorCode}";
                return View("UserAds");
            }
        }

        [Authorize]
        public async Task<IActionResult> DeleteAd(Guid adGuid)
        {
            //TODO delete Ad
            _userAdApiController.ControllerContext.HttpContext = HttpContext;
            ResponseBase response = await _userAdApiController.DeleteAd(adGuid);
            if (response.Success)
            {
                ViewData["Message"] = "آگهی حذف شد";
                return View("UserAds");
            }
            else
            {
                //TODO log error
                ViewData["Message"] = $"{response.Message} , {response.ErrorCode}";
                return View("UserAds");
            }
        }


        [Authorize]
        public async Task<IActionResult> EditAd(Guid adGuid)
        {
            //TODO Edit Ad open new ad page with data pushed from adGuid to the page
            return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<IActionResult> MarkedAds()
        {
            return View();
        }
    }
}
