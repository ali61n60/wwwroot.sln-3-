using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ModelStd.DB
{
    

    public class aspnet_Users
    {
       public aspnet_Users()
        {
            Advertisements = new HashSet<Advertisement>();
            aspnet_PersonalizationPerUser = new HashSet<aspnet_PersonalizationPerUser>();
        }

        public Guid ApplicationId { get; set; }

        [Key]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(256)]
        public string UserName { get; set; }

        [Required]
        [StringLength(256)]
        public string LoweredUserName { get; set; }

        [StringLength(16)]
        public string MobileAlias { get; set; }

        public bool IsAnonymous { get; set; }

        public DateTime LastActivityDate { get; set; }

        [StringLength(256)]
        public string emailAddress { get; set; }

        [StringLength(256)]
        public string phoneNumber { get; set; }

        public bool? emailAddressVerified { get; set; }

        public bool? phoneNumberVerified { get; set; }

        [StringLength(50)]
        public string emailAddressVerifyCode { get; set; }

        [StringLength(50)]
        public string phoneNumberVerifyCode { get; set; }

        public virtual ICollection<Advertisement> Advertisements { get; set; }

        public virtual aspnet_Applications aspnet_Applications { get; set; }

        public virtual aspnet_Membership aspnet_Membership { get; set; }

        public virtual ICollection<aspnet_PersonalizationPerUser> aspnet_PersonalizationPerUser { get; set; }

        public virtual aspnet_Profile aspnet_Profile { get; set; }

        
    }
}
