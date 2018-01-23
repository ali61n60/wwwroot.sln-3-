using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("SimilarAds",Schema = "ad")]
    public class SimilarAds
    {
        
        [Column("adId")]
        public Guid AdId { get; set; }

        [Column("similarAdId")]
        public Guid SimilarAdId { get; set; }

        public virtual Advertisements Ad { get; set; }
    }
}
