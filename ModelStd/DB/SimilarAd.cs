using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.DB
{
    

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
