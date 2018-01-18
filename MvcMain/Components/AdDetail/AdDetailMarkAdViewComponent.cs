using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Identity;

namespace MvcMain.Components.AdDetail
{
    public class AdDetailMarkAdViewComponent : ViewComponent
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;

        public AdDetailMarkAdViewComponent(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            //TODO think of what to do
            if (_signInManager.IsSignedIn(HttpContext.User))
            {
                return View();
            }

            return View();
        }
    }
}
