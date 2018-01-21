using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ModelStd.Db.Ad
{
    [Table("ApprovedAds",Schema = "ad")]
    public class ApprovedAd
    {
        [Column("adId")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }

        [Column("approvedDateTime", TypeName = "smalldatetime")]
        [Required]
        public DateTime ApprovedDateTime { get; set; }

        [Column("managedByAdmin")]
        [Required]
        public bool ManagedByAdmin { get; set; }

        public virtual Advertisements Ad { get; set; }
    }
}
