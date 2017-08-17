using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RepositoryStd.DB
{
    [Table("Price")]
    public class Price
    {
        [Key]
        public Guid adId { get; set; }

        [StringLength(150)]
        public string priceType { get; set; }

        [Column("price", TypeName = "money")]
        public decimal? price1 { get; set; }

        public virtual Advertisement Advertisement { get; set; }
    }
}
