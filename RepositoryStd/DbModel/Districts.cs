using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Districts
    {
        public Districts()
        {
            Advertisements = new HashSet<Advertisements>();
        }

        public int DistrictId { get; set; }
        public string DistrictName { get; set; }
        public int CityId { get; set; }
        public int? MunicipalId { get; set; }

        public virtual ICollection<Advertisements> Advertisements { get; set; }
        public virtual Cities City { get; set; }
    }
}
