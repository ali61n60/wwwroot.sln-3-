using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Brands
    {
        public Brands()
        {
            CarModel = new HashSet<CarModel>();
        }

        public int BrandId { get; set; }
        public string BrandName { get; set; }

        public virtual ICollection<CarModel> CarModel { get; set; }
    }
}
