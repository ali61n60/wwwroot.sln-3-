using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MvcMain.Models.Email
{
    [Table("Messages")]
    public class EmailMessage
    {
        public int id { get; set; }

        [NotMapped]
        public string SecurityCode { get; set; }

        [Required]
        [StringLength(50)]
        [Column("name")]
        public string Name { get; set; }

        [Required]
        [StringLength(250)]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [StringLength(50)]
        [Column("phone")]
        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(250)]
        [Column("title")]
        public string Title { get; set; }

        [Required]
        [StringLength(2500)]
        [Column("detail")]
        public string MessageDetail { get; set; }

        public MessageStatus MessageStatus { get; set; }

        [NotMapped]
        public string DetailsClass => MessageStatus == MessageStatus.New ? "new-message" : "seen-message";
    }

    public enum MessageStatus
    {
        New,
        Seen
    }
}
