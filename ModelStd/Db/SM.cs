using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db
{

    [Table("ad.SMS")]
    public partial class SM
    {
        [Key]
        public Guid messageId { get; set; }

        [Required]
        [StringLength(256)]
        public string message { get; set; }

        [Required]
        [StringLength(256)]
        public string phoneNumber { get; set; }

        public DateTime messageDate { get; set; }

        public bool sent { get; set; }
    }
}
