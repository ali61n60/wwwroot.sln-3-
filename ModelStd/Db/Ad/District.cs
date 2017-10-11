using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ModelStd.Db.Ad
{
    [Table("Districts")]
    public class District
    {
        public District()
        {
            Advertisements = new HashSet<Advertisement>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int districtId { get; set; }

        [Required]
        [StringLength(150)]
        public string districtName { get; set; }

        public int cityId { get; set; }

        public int? municipalId { get; set; }

        public virtual ICollection<Advertisement> Advertisements { get; set; }

        public virtual City City { get; set; }
    }
}
