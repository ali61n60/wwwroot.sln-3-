using System;
using System.Collections.Generic;

namespace ModelStd.Db.Ad
{
    public partial class Categories
    {
        public Categories()
        {
            Advertisements = new HashSet<Advertisements>();
        }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryParentId { get; set; }
        public string CategoryNameEnglish { get; set; }

        public virtual ICollection<Advertisements> Advertisements { get; set; }
    }
}
