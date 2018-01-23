using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ModelStd.Db.Identity;

namespace ModelStd.Db.Ad
{
    [Table("SmsMessages",Schema = "ad")]
    public class SmsMessage
    {
        [Key]
        [Column("messageId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MessageId { get; set; }

        [Column("textMessage")]
        [Required]
        [MaxLength(1000)]
        public string TextMessage { get; set; }

        [Column("userId")]
        [Required]
        [MaxLength(450)]
        public string UserId { get; set; }

        [Column("messageDate",TypeName = "datetime")]
        [Required]
        public DateTime MessageDate { get; set; }

        [Column("sent")]
        [Required]
        public bool Sent { get; set; }

        [Column("messagePriority",TypeName = "int")]
        [Required]
        public MessagePriority Priority { get; set; }

        public virtual AspNetUsers User { get; set; }

    }

    public enum MessagePriority
    {
        High=0,
        Medium=1,
        Low=2
    }
}
