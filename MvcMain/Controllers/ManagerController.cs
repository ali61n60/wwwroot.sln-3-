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
    }
}
