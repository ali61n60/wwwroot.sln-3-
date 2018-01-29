using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelStd;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;
using ModelStd.Services;
using MvcMain.Models;
using RepositoryStd.Context.Identity;


namespace MvcMain.Controllers
{
    public class AccountController : Controller
    {
        //TODO Error messages are in English, Try to make them Persian
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly MessageApiController _messageApiController;
        private readonly IPasswordValidator<AppUser> _passwordValidator;
        private readonly IPasswordHasher<AppUser> _passwordHasher;

        private readonly AppIdentityDbContext _appIdentityDbContext;


        public AccountController(UserManager<AppUser> userMgr, SignInManager<AppUser> signinMgr
            , IPasswordHasher<AppUser> passwordHasher, MessageApiController messageApiController
            , AppIdentityDbContext appIdentityDbContext, IPasswordValidator<AppUser> passwordValidator)
        {
            _userManager = userMgr;
            _signInManager = signinMgr;
            _passwordHasher = passwordHasher;
            _passwordValidator = passwordValidator;
            _messageApiController = messageApiController;
            _appIdentityDbContext = appIdentityDbContext;
        }


        [Authorize]
        public async Task<IActionResult> AccountManagement(string message)
        {
            AppUser user = await _userManager.GetUserAsync(HttpContext.User);
            ViewData["Message"] = message;
            return View(user);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> EditProfile()
        {
            AppUser user = await _userManager.GetUserAsync(HttpContext.User);
            EditProfileModel editProfileModel = new EditProfileModel
            {
                FirstName = user.FirstNameEx,
                LastName = user.LastNameEx,
                PhoneNumber = user.PhoneNumber
            };
            return View(editProfileModel);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EditProfile(EditProfileModel editProfileModel)
        {
            string errorCode = "AccountController/EditProfile";
            if (ModelState.IsValid)
            {
                try
                {
                    AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                    user.FirstNameEx = editProfileModel.FirstName;
                    user.LastNameEx = editProfileModel.LastName;
                    string oldUserPhoneNumber = user.PhoneNumber;
                    if (oldUserPhoneNumber != editProfileModel.PhoneNumber)
                    {
                        user.PhoneNumber = editProfileModel.PhoneNumber;
                        user.PhoneNumberConfirmed = false;
                    }
                    
                    _appIdentityDbContext.Entry(user).State = EntityState.Modified;
                    await _appIdentityDbContext.SaveChangesAsync();
                    return RedirectToAction("AccountManagement");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("Exception", ex.Message + " ," + errorCode);
                }
            }

            return View(editProfileModel);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ConfirmEmailAndPhoneNumber()
        {
            AppUser user = await _userManager.GetUserAsync(HttpContext.User);
            ConfirmEmailAndPhoneNumberModel confirmEmailAndPhoneNumber = new ConfirmEmailAndPhoneNumberModel
            {
                EmailAddress = user.Email,
                EmailConfirmed = user.EmailConfirmed,
                PhoneNumber = user.PhoneNumber,
                PhoneNumberConfirmed = user.PhoneNumberConfirmed
            };
            return View(confirmEmailAndPhoneNumber);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmEmailAndPhoneNumber(ConfirmEmailAndPhoneNumberModel confirmEmailAndPhoneNumber)
        {
            if (ModelState.IsValid)
            {
                //set emailConfirm and sms confirm for user based on user input and records in database
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
            }
            
            

            return View(confirmEmailAndPhoneNumber);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> SendEmailConfirm()
        {
            //TODO send an email to the user and push the user EmailConfirmCode
            return View();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> SendSmsConfirm()
        {
            //TODO send an sms to the user and push the user PhoneNumberConfirmCode
            return View();
        }



        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ChangePassword()
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel changePasswordModel)
        {
            string errorCode = "AccountController/ChangePassword";
            if (ModelState.IsValid)
            {
                if (changePasswordModel.Password != changePasswordModel.RepeatPassword)
                {
                    ModelState.AddModelError("PasswordRepeat", "فیلد رمز ورود و فیلد تکرار رمز ورود باید برابر باشد");
                }
                else
                {
                    try
                    {
                        AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                        if (user != null)
                        {
                            if (!string.IsNullOrEmpty(changePasswordModel.Password))
                            {
                                IdentityResult validPass = await _passwordValidator.ValidateAsync(_userManager,user, changePasswordModel.Password);
                                if (validPass.Succeeded)
                                {
                                    user.PasswordHash = _passwordHasher.HashPassword(user, changePasswordModel.Password);
                                    IdentityResult result = await _userManager.UpdateAsync(user);
                                    if (result.Succeeded)
                                    {
                                        return RedirectToAction("AccountManagement", new { message = "رمز ورود با موفقیت تغییر کرد" });
                                    }
                                    else
                                    {
                                        AddErrorsFromResult(result);
                                    }
                                }
                                else
                                {
                                    AddErrorsFromResult(validPass);
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError("Exception", ex.Message + " ," + errorCode);
                    }
                }
            }
            return View(changePasswordModel);
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
            string errorCode = "AccountController/Login";
            if (ModelState.IsValid)
            {
                try
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
                        else
                        {
                            ModelState.AddModelError("Password", "خطا در رمز ورود");
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("UserNull", "ایمیل وارد شده در دیتابیس وجود ندارد");
                    }

                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("Exception", ex.Message + " " + errorCode);
                }
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
            string errorCode = "AccountController/PasswordForget";
            if (ModelState.IsValid)
            {
                try
                {
                    AppUser user = await _userManager.FindByEmailAsync(detail.Email);
                    if (user != null)
                    {
                        string serverGeneratedNewPassword = createRandomPassword();
                        user.PasswordHash = _passwordHasher.HashPassword(user, serverGeneratedNewPassword);
                        IdentityResult changePassResult = await _userManager.UpdateAsync(user);
                        if (changePassResult.Succeeded)
                        {
                            //TODO extract a method for email creation
                            EmailMessageSingle emailMessageSingle = new EmailMessageSingle();
                            emailMessageSingle.EmailAddress = detail.Email;
                            string messageText = $"<p dir=\"rtl\">";
                            messageText += "رمز عبور شما عبارت زیر میباشد: ";

                            messageText += "</p><br/><br/>";
                            messageText += $"<span style=\"color:red\">{serverGeneratedNewPassword}</span>";
                            emailMessageSingle.Subject = "فراموشی رمز عبور";
                            emailMessageSingle.Title = "فراموشی رمز عبور";
                            emailMessageSingle.TextMessage = messageText;
                            ResponseBase emailResponse = await _messageApiController.InsertEmailMessageInDataBase(emailMessageSingle, user.Id, MessagePriority.High);
                            if (emailResponse.Success)
                            {
                                ViewBag.returnUrl = returnUrl ?? "/";
                                ViewData["Message"] = "کاربر گرامی. رمز عبور جدید به ایمیل شما ارسال میشود. لطفا با رمز جدید وارد شده و به منظور افزایش امنیت در اولین فرصت رمز خود را تغییر دهید.";
                                return View("Login");
                            }
                            else
                            {
                                ModelState.AddModelError("EmailResponse", emailResponse.Message + ", " + emailResponse.ErrorCode);
                            }
                        }
                        else
                        {
                            int errorIndex = 0;
                            foreach (IdentityError identityError in changePassResult.Errors)
                            {
                                ModelState.AddModelError("ChangePassResult" + errorIndex, identityError.Description);
                                errorIndex++;
                            }
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("UserNull", "ایمیل وارد شده در دیتابیس یافت نشد");
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("Exception", ex.Message + " " + errorCode);
                }
            }
            return View(detail);
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
            //TODO check email and phone number by regex
            //TODO Check email not exist already 
            //TODO Check EmailConfiremed AND PhoneNumberConfiremed Are Flase
            ViewBag.returnUrl = returnUrl;
            if (ModelState.IsValid)
            {
                if (model.Password != model.RepeatPassword)
                {
                    ModelState.AddModelError("PasswordRepeat", "فیلد رمز ورود و فیلد تکرار رمز ورود باید برابر باشد");
                }
                else
                {
                    AppUser user = new AppUser
                    {
                        UserName = model.Email,
                        Email = model.Email,
                        PhoneNumber = model.PhoneNumber
                    };
                    IdentityResult result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        return Redirect(returnUrl ?? "/");
                    }
                    else
                    {
                        foreach (IdentityError error in result.Errors)
                        {
                            ModelState.AddModelError("", error.Description);
                        }
                    }
                }

            }
            return View(model);
        }

        private string createRandomPassword()
        {
            Random random = new Random();
            string password = "";
            for (int i = 0; i < 3; i++)
                password += Convert.ToChar(random.Next(65, 90));//65==>A ,  90=>Z 
            password += "@9";
            for (int i = 0; i < 3; i++)
                password += Convert.ToChar(random.Next(97, 122));//97=>a ,  122=>z

            return password;
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }

        private void AddErrorsFromResult(IdentityResult result)
        {
            foreach (IdentityError error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
        }
    }
}
