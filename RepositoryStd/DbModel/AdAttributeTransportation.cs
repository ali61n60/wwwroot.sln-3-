using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class AdAttributeTransportation
    {
        public Guid AttributeId { get; set; }
        public Guid AdId { get; set; }
        public int? ModelId { get; set; }
        public int? MakeYear { get; set; }
        public string Fuel { get; set; }
        public int? Mileage { get; set; }
        public string Gearbox { get; set; }
        public string BodyColor { get; set; }
        public string InternalColor { get; set; }
        public string BodyStatus { get; set; }

        public virtual Advertisements Ad { get; set; }
        public virtual CarModel Model { get; set; }
    }
}
