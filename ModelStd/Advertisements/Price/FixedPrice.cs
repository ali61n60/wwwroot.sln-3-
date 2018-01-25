using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    [Table("Price", Schema = "ad")]
    public class FixedPrice:IPrice
    {
        public PriceType PriceType { get; }

        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }

        [Column("price", TypeName = "money")]
        [DataType(DataType.Currency)]
        public decimal PriceAmount { get; set; }

        public FixedPrice(decimal priceAmount)
        {
            PriceType = PriceType.Fixed;
            PriceAmount = priceAmount;
        }
        public override string ToString()
        {
            return "قیمت" + " : " + PriceAmount;
        }

        public virtual Advertisement Ad { get; set; }
    }
}
