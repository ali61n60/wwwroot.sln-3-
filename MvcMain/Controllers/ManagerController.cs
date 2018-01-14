using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Controllers
{
    
    //TODO manage submitted ads, inform users registerd in LetMeKnow page
    //TODO
    //TODO manage Ad image folder
    public class ManagerController:Controller
    {
        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> ManageSubmittedAds()
        {
            return View();
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> ManageAdImageFolder()
        {
            return View("ManageAdImageFolder","");
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> RemoveFoldersWithNoDatabaseRecords()
        {
            //TODO implement RemoveFoldersWithNoDatabaseRecords
            //Get All Folders from image repository
            //Get All AdId from database
            //foreach folder if there is on adId keep it elese remove it
            return View("ManageAdImageFolder","Folders Removed");
        }

    }
}
