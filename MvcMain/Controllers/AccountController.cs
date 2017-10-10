using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MvcMain.Models;
using RepositoryStd.DbModel.Identity;

namespace MvcMain.Controllers
{
    public class AccountController:Controller
    {
        //TODO Error messages are in English, Try to make them Persian
        private UserManager<AppUser> _userManager;
        private SignInManager<AppUser> _signInManager;
        private ConfigurationRoot _appConfiguration;

        public AccountController(UserManager<AppUser> userMgr, SignInManager<AppUser> signinMgr)
        {
            _userManager = userMgr;
            _signInManager = signinMgr;
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
                ModelState.AddModelError(nameof(LoginModel.Email),
                    "Invalid user or password");
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
            //TODO Email user password or do appropriate action
            //TODO Make your action as an API to be able to use that from android app
            return RedirectToAction("Login",new { returnUrl =returnUrl?? "/" });
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
