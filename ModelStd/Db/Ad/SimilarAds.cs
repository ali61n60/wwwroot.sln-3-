using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("SimilarAds",Schema = "ad")]
    public partial class SimilarAds
    {
        [Key]
        [Column("adId")]
        public Guid AdId { get; set; }

        [Column("similarAdId")]
        public Guid SimilarAdId { get; set; }

        public virtual Advertisements Ad { get; set; }
    }
}
