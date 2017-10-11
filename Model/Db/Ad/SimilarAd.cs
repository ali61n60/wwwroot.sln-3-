namespace Model.Db.Ad
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ad.SimilarAds")]
    public partial class SimilarAd
    {
        [Key]
        [Column(Order = 0)]
        public Guid adId { get; set; }

        [Key]
        [Column(Order = 1)]
        public Guid similarAdId { get; set; }

        public virtual Advertisement Advertisement { get; set; }
    }
}
