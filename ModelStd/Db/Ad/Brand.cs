using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Brands", Schema = "ad")]
    public class Brand
    {
        public Brand()
        {
            CarModels = new HashSet<CarModel>();
        }

        [Key]
        [Column("brandId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int BrandId { get; set; }

        [Column("brandName")]
        [Required]
        [MaxLength(150)]
        public string BrandName { get; set; }

        public virtual ICollection<CarModel> CarModels { get; set; }
    }
}
