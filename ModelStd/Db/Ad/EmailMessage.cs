using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using ModelStd.Db.Identity;

namespace ModelStd.Db.Ad
{
    [Table("EmailMessages", Schema = "ad")]
    public class EmailMessage
    {
        [Key]
        [Column("messageId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MessageId { get; set; }

        [Column("subject")]
        [Required]
        [MaxLength(300)]
        public string Subject { get; set; }

        [Column("titleMessage")]
        [Required]
        [MaxLength(100)]
        public string TitleMessage { get; set; }

        [Column("textMessage")]
        [Required]
        [MaxLength(1000)]
        public string TextMessage { get; set; }

        [Column("userId")]
        [Required]
        [MaxLength(450)]
        public string UserId { get; set; }

        [Column("messageDate", TypeName = "datetime")]
        [Required]
        public DateTime MessageDate { get; set; }

        [Column("sent")]
        [Required]
        public bool Sent { get; set; }

        [Column("messagePriority", TypeName = "int")]
        [Required]
        public MessagePriority Priority { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
