using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("CarModel")]
    public class CarModel
    {
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

        public virtual ICollection<AdAttributeTransportation> AdAttributeTransportations { get; set; }

        public virtual Brand Brand { get; set; }
    }
}
