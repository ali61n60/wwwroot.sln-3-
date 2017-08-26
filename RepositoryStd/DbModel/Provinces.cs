using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Provinces
    {
        public Provinces()
        {
            Cities = new HashSet<Cities>();
        }

        public int ProvinceId { get; set; }
        public string ProvinceName { get; set; }
        public string ProvinceCenter { get; set; }

        public virtual ICollection<Cities> Cities { get; set; }
    }
}
