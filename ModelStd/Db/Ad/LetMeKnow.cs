using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using ModelStd.Db.Identity;

namespace ModelStd.Db.Ad
{
    [Table("LetMeKnow",Schema = "ad")]
    public class LetMeKnow
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("userId")]
        [Required]
        [MaxLength(450)]
        public string UserId { get; set; }

        [Column("categoryId")]
        public int CategoryId { get; set; }

        [Column("emailOrSms", TypeName = "int")]
        [Required]
        public EmailOrSms EmailOrSms { get; set; }

        [Column("requestInsertDateTime", TypeName = "smalldatetime")]
        [Required]
        public DateTime RequestInsertDateTime { get; set; }

        [Column("requetsPrivilege", TypeName = "int")]
        [Required]
        public RequetsPrivilege RequetsPrivilege { get; set; }

        public virtual AspNetUsers User { get; set; }
        public virtual Categories Category { get; set; }
    }

    public enum EmailOrSms
    {
        Email=1,
        Sms=2,
        Both=3
    }

    public enum RequetsPrivilege
    {
        Gold=1,
        Silver=2,
        Normal=3
    }
}
