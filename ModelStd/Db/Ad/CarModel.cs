using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("CarModels", Schema = "ad")]
    public class CarModel
    {
        public CarModel()
        {
            AdAttributeTransportations = new HashSet<AdAttributeTransportation>();
        }

        [Key]
        [Column("modelId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ModelId { get; set; }

        [Column("modelName")]
        [Required]
        [MaxLength(150)]
        public string ModelName { get; set; }

        [Column("brandId")]
        public int BrandId { get; set; }

        public virtual ICollection<AdAttributeTransportation> AdAttributeTransportations { get; set; }
        public virtual Brand Brand { get; set; }
    }
}
