using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
   
    [Table("Categories")]
    public class Category
    {
        public Category()
        {
            Advertisements = new HashSet<Advertisement>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        public int categoryId { get; set; }

        [Required]
        [StringLength(150)]
        public string categoryName { get; set; }

        [StringLength(10)]
        public string categoryParentId { get; set; }

        [StringLength(150)]
        public string categoryNameEnglish { get; set; }

        public virtual ICollection<Advertisement> Advertisements { get; set; }
    }
}
