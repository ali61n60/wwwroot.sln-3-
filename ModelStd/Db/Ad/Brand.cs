using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
   
    [Table("Brands")]
    public class Brand
    {
        public Brand()
        {
            CarModels = new HashSet<CarModel>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        public int brandId { get; set; }

        [Required]
        [StringLength(150)]
        public string brandName { get; set; }

        public virtual ICollection<CarModel> CarModels { get; set; }
    }
}
