using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Identity;

namespace MvcMain.Components
{
    public class ManagerNavBarViewComponent : ViewComponent
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;

        public ManagerNavBarViewComponent(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            if (_signInManager.IsSignedIn(HttpContext.User))
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);

                if (await _userManager.IsInRoleAsync(user, "Admins"))
                {
                    return View("AdminUser");
                }
            }

            return View();
        }
    }
}
