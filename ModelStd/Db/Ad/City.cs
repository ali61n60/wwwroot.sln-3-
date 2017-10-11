using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Cities")]
    public partial class City
    {
        public City()
        {
            Districts = new HashSet<District>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int cityId { get; set; }

        [Required]
        [StringLength(150)]
        public string cityName { get; set; }

        public int? provinceId { get; set; }

        public virtual Province Province { get; set; }

        public virtual ICollection<District> Districts { get; set; }
    }
}
