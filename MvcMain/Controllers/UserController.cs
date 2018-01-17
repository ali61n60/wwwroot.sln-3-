using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Db.Identity;
using ModelStd.IRepository;
using ModelStd.Services;
using MvcMain.Infrastructure;

namespace MvcMain.Controllers
{
    public class UserController:Controller
    {
        private UserAdApiController _userAdApiController;
        

        private string _messageToUser = "";

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
        public async Task<IActionResult> DeleteAd(Guid adGuid)
        {
            //TODO delete Ad
           return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<IActionResult> EditAd(Guid adGuid)
        {
            //TODO Edit Ad open new ad page with data pushed from adGuid to the page
            return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<IActionResult> UpdateAd(Guid adGuid)
        {
            //TODO Update Ad withot changing ad contents just set its insertion time to now
            //TODO make sure the ad owner is calling this method
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
        public async Task<IActionResult> MarkedAds()
        {
            return View();
        }
    }
}
