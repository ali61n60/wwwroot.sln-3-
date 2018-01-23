using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Provinces",Schema = "ad")]
    public class Province
    {
        public Province()
        {
            Cities = new HashSet<City>();
        }

        [Key]
        [Column("provinceId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ProvinceId { get; set; }

        [Column("provinceName")]
        [Required]
        [MaxLength(150)]
        public string ProvinceName { get; set; }

        [Column("provinceCenter")]
        [Required]
        [MaxLength(150)]
        public string ProvinceCenter { get; set; }

        public virtual ICollection<City> Cities { get; set; }
    }
}
