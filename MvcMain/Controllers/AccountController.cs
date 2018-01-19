using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd;
using ModelStd.Db.Identity;
using MvcMain.Infrastructure;
using MvcMain.Models;


namespace MvcMain.Controllers
{
    public class AccountController:Controller
    {
        //TODO Error messages are in English, Try to make them Persian
        private UserManager<AppUser> _userManager;
        private SignInManager<AppUser> _signInManager;
        private MessageApiController _messageApiController;
        private IPasswordHasher<AppUser> _passwordHasher;


        public AccountController(UserManager<AppUser> userMgr, SignInManager<AppUser> signinMgr
            , IPasswordHasher<AppUser> passwordHasher, MessageApiController messageApiController)
        {
            _userManager = userMgr;
            _signInManager = signinMgr;
            _passwordHasher = passwordHasher;
            _messageApiController = messageApiController;
        }

        [AllowAnonymous]
        public IActionResult Login(string returnUrl)
        {
            ViewBag.returnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginModel details, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                AppUser user = await _userManager.FindByEmailAsync(details.Email);
                if (user != null)
                {
                    await _signInManager.SignOutAsync();
                    Microsoft.AspNetCore.Identity.SignInResult result =
                        await _signInManager.PasswordSignInAsync(user, details.Password, details.RememberMe, false);
                    if (result.Succeeded)
                    {
                        return Redirect(returnUrl ?? "/");
                    }
                }
                ModelState.AddModelError(nameof(LoginModel.Email),"Invalid user or password");
            }
            return View(details);
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        [AllowAnonymous]
        public IActionResult PasswordForget(string returnUrl)
        {
            ViewBag.returnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PasswordForget(PasswordForgetModel detail, string returnUrl)
        {
            //TODO Make your action as an API to be able to use that from android app
            AppUser user =await _userManager.FindByEmailAsync(detail.Email);
            if (user == null)
            {
                //tell user there is not such an email in our database
                ViewData["Message"] = "ایمیل وارد شده در دیتابیس یافت نشد";
                return View();
            }
            string serverGeneratedNewPassword = "1234@Ali";
            user.PasswordHash = _passwordHasher.HashPassword(user,serverGeneratedNewPassword);
            IdentityResult changePassResult = await _userManager.UpdateAsync(user);
            if (changePassResult.Succeeded)
            {
                EmailMessageSingle emailMessageSingle = new EmailMessageSingle();
                emailMessageSingle.EmailAddress = detail.Email;
                string messageText = $"<p dir=\"rtl\">";
                messageText+="رمز عبور شما عبارت زیر میباشد: ";

                messageText += "</p><br/><br/>";
                messageText += $"<span style=\"color:red\">{serverGeneratedNewPassword}</span>";
                emailMessageSingle.Subject = "فراموشی رمز عبور";
                emailMessageSingle.Title = "فراموشی رمز عبور";
                emailMessageSingle.TextMessage = messageText;
                await _messageApiController.InsertEmailMessageInDataBase(emailMessageSingle,user.Id);
                ViewBag.returnUrl = returnUrl ?? "/";
                return View("Login");
            }
            else
            {
                string errorMessage = "";
                foreach (IdentityError identityError in changePassResult.Errors)
                {
                    errorMessage+= identityError.Description+"  ";
                }
                ViewData["Message"] = errorMessage;
                return View();
            }
         
            
        }

        [AllowAnonymous]
        public ViewResult Create(string returnUrl)
        {
            ViewBag.returnUrl = returnUrl;
            return View();
        }


        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateModel model, string returnUrl)
        {
            //TODO Make your action as an API to be able to use that from android app
            //TODO Check password and repeatPassword are equal
            //TODO Check EmailConfiremed AND PhoneNumberConfiremed Are Flase
            ViewBag.returnUrl = returnUrl;
            if (ModelState.IsValid)
            {
                if (model.Password != model.RepeatPassword)
                {
                    ModelState.AddModelError("","Password and Repeated Password are not equal.");
                    return View(model);
                }
                AppUser user = new AppUser
                {
                    UserName = model.Name,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber
                };
                IdentityResult result= await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    return RedirectToRoute("/");
                }
                else
                {
                    foreach (IdentityError error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }
            }
            return View(model);
        }




        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }

    }
}
