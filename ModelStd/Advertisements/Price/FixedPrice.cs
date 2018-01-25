using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    [Table("FixedPrices", Schema = "ad")]
    public class FixedPrice:IPrice
    {
        public PriceType PriceType { get; }

        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }

        [Column("priceAmount", TypeName = "money")]
        [DataType(DataType.Currency)]
        public decimal PriceAmount { get; set; }

        public FixedPrice()
        {
            PriceType = PriceType.Fixed;
        }

        public string PriceString => "قیمت" + " : " + PriceAmount.ToString("N0");
    }
}
