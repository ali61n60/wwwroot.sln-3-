using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Price
    {
        public Guid AdId { get; set; }
        public string PriceType { get; set; }
        public decimal? Price1 { get; set; }

        public virtual Advertisements Ad { get; set; }
    }
}
