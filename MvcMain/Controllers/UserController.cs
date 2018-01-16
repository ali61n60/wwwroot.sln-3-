using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Db.Identity;
using ModelStd.IRepository;

namespace MvcMain.Controllers
{
    public class UserController:Controller
    {
        private ICommonRepository _commonRepository;
        private readonly UserManager<AppUser> _userManager;
        public UserController(ICommonRepository commonRepository, UserManager<AppUser> userManager)
        {
            _commonRepository = commonRepository;
            _userManager = userManager;
        }

        [Authorize]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> UserAds()
        {
            AppUser user = await _userManager.GetUserAsync(HttpContext.User);
            IEnumerable<AdvertisementCommon> allUserAdvertisement= _commonRepository.GetUserAdvertisements(user.Id);
            
            
            return View(allUserAdvertisement);
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
            return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<IActionResult> MarkedAds()
        {
            return View();
        }
    }
}
