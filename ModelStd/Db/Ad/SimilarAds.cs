using System;
using System.Collections.Generic;

namespace ModelStd.Db.Ad
{
    public partial class SimilarAds
    {
        public Guid AdId { get; set; }
        public Guid SimilarAdId { get; set; }

        public virtual Advertisements Ad { get; set; }
    }
}
