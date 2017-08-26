using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class MobileBrands
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public int BrandMakerId { get; set; }
    }
}
