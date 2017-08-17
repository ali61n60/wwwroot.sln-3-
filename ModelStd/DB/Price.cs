using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ModelStd.Advertisements;

namespace ModelStd.DB
{
    [Table("Price")]
    public partial class Price
    {
        [Key]
        public Guid adId { get; set; }

        [StringLength(150)]
        public string priceType { get; set; }

        [Column("price", TypeName = "money")]
        public decimal? price { get; set; }

        public virtual Advertisement Advertisement { get; set; }
    }

   
}
