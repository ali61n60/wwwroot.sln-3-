using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ModelStd.Db.Identity
{
    [Table("UsersExtraInfo",Schema = "identity")]
    public class UserExtraInfo
    {
        [Key]
        [Column("Id")]
       
        public string Id { get; set; }

        [Column("FirstName")]
        [MaxLength(200)]
        public string FirstName { get; set; }

        [Column("LastName")]
        [MaxLength(200)]
        public string LastName { get; set; }

        public string EmailAddressVerifyCode { get; set; }
        public string PhoneNumberVerifyCode { get; set; }


        public virtual AspNetUsers User { get; set; }

    }
}
