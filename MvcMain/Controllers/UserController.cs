using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace MvcMain.Controllers
{
    //TODO delete ad, update ad , delete letmeknow return to wrong view
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

        [Authorize]
        public async Task<IActionResult> UserLetMeKnows(string message)
        {
            _userAdApiController.ControllerContext.HttpContext = HttpContext;
            ResponseBase<List<ModelStd.Db.Ad.LetMeKnow>> response= await _userAdApiController.GetUserLetMeKnows();
            if (response.Success)
            {
                ViewData["Message"] = message;
                return View(response.ResponseData);
            }
            else
            {
                ViewData["Message"] = $"{response.Message} , {response.ErrorCode}";
                return View();
            }
            
        }

        [Authorize]
        public async Task<IActionResult> DeleteLetMeKnow(int id)
        {
            _userAdApiController.ControllerContext.HttpContext = HttpContext;
            ResponseBase response = await _userAdApiController.DeleteLetMeKnow(id);
            string message;
            if (response.Success)
            {
                 message = "به من اطلاع بده حذف شد";
            }
            else
            {
                //TODO log error
                message = $"{response.Message} , {response.ErrorCode}";
            }
            return RedirectToAction("UserLetMeKnows", new { message = message });
        }
    }
}
