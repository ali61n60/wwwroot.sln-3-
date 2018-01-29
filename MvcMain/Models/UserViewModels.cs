using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ModelStd.Db.Identity;

namespace MvcMain.Models
{
    public class CreateModel
    {
        [Required(ErrorMessage = "فیلد ایمیل خالی است")]
        public string Email { get; set; }

        [Required(ErrorMessage = "فیلد رمز ورود خالی است")]
        public string Password { get; set; }

        [Required(ErrorMessage = "فیلد تکرار رمز ورود خالی است")]
        public string RepeatPassword { get; set; }

        [Required(ErrorMessage = "فیلد تلفن همراه خالی است")]
        public string PhoneNumber { get; set; }
    }

    public class LoginModel
    {
        [Required(ErrorMessage = "فیلد ایمیل خالی است")]
        [UIHint("email")]
        
        public string Email { get; set; }
        [Required(ErrorMessage = "فیلد رمز ورود خالی است")]
        [UIHint("password")]
        public string Password { get; set; }
        
        [Required]
        [UIHint("remember me")]
        public bool RememberMe { get; set; }
    }

    public class PasswordForgetModel
    {
        [Required(ErrorMessage = "فیلد ایمیل خالی است")]
        [UIHint("email")]
        public string Email { get; set; }
    }

    public class RoleEditModel
    {
        public IdentityRole Role { get; set; }
        public IEnumerable<AppUser> Members { get; set; }
        public IEnumerable<AppUser> NonMembers { get; set; }
    }
    public class RoleModificationModel
    {
        [Required]
        public string RoleName { get; set; }
        public string RoleId { get; set; }
        public string[] IdsToAdd { get; set; }
        public string[] IdsToDelete { get; set; }
    }

    public class EditProfileModel
    {
        [Required(ErrorMessage = "فیلد نام خالی است")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "فیلد نام خانوادگی خالی است")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "فیلد تلفن همراه خالی است")]
        public string PhoneNumber { get; set; }
    }

    public class ChangePasswordModel
    {
        [Required(ErrorMessage = "فیلد رمز ورود خالی است")]
        public string Password { get; set; }

        [Required(ErrorMessage = "فیلد تکرار رمز ورود خالی است")]
        public string RepeatPassword { get; set; }
    }

    public class ConfirmEmailAndPhoneNumberModel
    {
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
    }
}
