namespace Repository.DBEintityFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("AdAttributeTransportation")]
    public partial class AdAttributeTransportation
    {
        [Key]
        public Guid attributeId { get; set; }

        public Guid adId { get; set; }

        public int? modelId { get; set; }

        public int? makeYear { get; set; }

        [StringLength(50)]
        public string fuel { get; set; }

        public int? mileage { get; set; }

        [StringLength(50)]
        public string gearbox { get; set; }

        [StringLength(50)]
        public string bodyColor { get; set; }

        [StringLength(50)]
        public string internalColor { get; set; }

        [StringLength(50)]
        public string bodyStatus { get; set; }

        public virtual Advertisement Advertisement { get; set; }

        public virtual CarModel CarModel { get; set; }
    }
}
