using System;
using System.Collections.Generic;

namespace ModelStd.Db.Ad
{
    public partial class CarModel
    {
        public CarModel()
        {
            AdAttributeTransportation = new HashSet<AdAttributeTransportation>();
        }

        public int ModelId { get; set; }
        public string ModelName { get; set; }
        public int BrandId { get; set; }

        public virtual ICollection<AdAttributeTransportation> AdAttributeTransportation { get; set; }
        public virtual Brand Brand { get; set; }
    }
}
