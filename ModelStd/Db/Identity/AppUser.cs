﻿using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ModelStd.Db.Identity
{
    public class AppUser : IdentityUser
    {

        [Required]
        [MaxLength(200)]
        public string FirstNameEx { get; set; }

        [Required]
        [MaxLength(200)]
        public string LastNameEx { get; set; }

        [Required]
        [MaxLength(200)]
        public string EmailAddressVerifyCodeEx { get; set; }

        [Required]
        [MaxLength(200)]
        public string PhoneNumberVerifyCodeEx { get; set; }
    }
}
