using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Categories", Schema = "ad")]
    public partial class Categories
    {
        public Categories()
        {
            Advertisements = new HashSet<Advertisements>();
        }

        [Key]
        [Column("categoryId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int CategoryId { get; set; }

        [Column("categoryName")]
        [Required]
        [MaxLength(150)]
        public string CategoryName { get; set; }

        [Column("categoryParentId")]
        public string CategoryParentId { get; set; }

        [Column("categoryNameEnglish")]
        [MaxLength(150)]
        public string CategoryNameEnglish { get; set; }

        public virtual ICollection<Advertisements> Advertisements { get; set; }
    }
}
