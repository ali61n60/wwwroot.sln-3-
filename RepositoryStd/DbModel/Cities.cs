using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Cities
    {
        public Cities()
        {
            Districts = new HashSet<Districts>();
        }

        public int CityId { get; set; }
        public string CityName { get; set; }
        public int? ProvinceId { get; set; }

        public virtual ICollection<Districts> Districts { get; set; }
        public virtual Provinces Province { get; set; }
    }
}
