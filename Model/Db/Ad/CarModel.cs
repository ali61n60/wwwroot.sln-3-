namespace Model.Db.Ad
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ad.CarModel")]
    public partial class CarModel
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CarModel()
        {
            AdAttributeTransportations = new HashSet<AdAttributeTransportation>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int modelId { get; set; }

        [Required]
        [StringLength(150)]
        public string modelName { get; set; }

        public int brandId { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AdAttributeTransportation> AdAttributeTransportations { get; set; }

        public virtual Brand Brand { get; set; }
    }
}
