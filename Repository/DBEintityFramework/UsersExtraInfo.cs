namespace Repository.DBEintityFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("UsersExtraInfo")]
    public partial class UsersExtraInfo
    {
        [Key]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(256)]
        public string emailAddress { get; set; }

        [Required]
        [StringLength(16)]
        public string phoneNumber { get; set; }

        public bool emailAddressVerified { get; set; }

        public bool phoneNumberVerified { get; set; }

        [StringLength(50)]
        public string emailAddressVerifyCode { get; set; }

        [StringLength(50)]
        public string phoneNumberVerifyCode { get; set; }
    }
}
