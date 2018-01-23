using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Cities",Schema = "ad")]
    public class City
    {
        public City()
        {
            Districts = new HashSet<District>();
        }

        [Key]
        [Column("cityId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int CityId { get; set; }

        [Column("cityName")]
        [Required]
        [MaxLength(150)]
        public string CityName { get; set; }

        [Column("provinceId")]
        [Required]
        public int? ProvinceId { get; set; }

        public virtual ICollection<District> Districts { get; set; }
        public virtual Province Province { get; set; }
    }
}
