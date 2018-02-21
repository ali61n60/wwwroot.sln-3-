using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Advertisements.Price
{
    [Table("FixedPrices", Schema = "ad")]
    public partial class FixedPrice:IPrice
    {
        
        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }

        [Column("priceAmount", TypeName = "money")]
        [DataType(DataType.Currency)]
        public decimal PriceAmount { get; set; }

        public PriceType PriceType { get; }

        public FixedPrice()
        {
            PriceType = PriceType.Fixed;
        }

        public string PriceString => "قیمت" + " : " + PriceAmount.ToString("N0");
    }

    public partial class FixedPrice
    {
        public static readonly string PriceTypeKey = "PriceType";
        public static readonly PriceType PriceTypeDefault = PriceType.All;

        public static readonly string MinPriceKey = "MinimumPrice";
        public static readonly decimal MinPriceDefault = -1;

        public static readonly string MaxPriceKey = "MaximumPrice";
        public static readonly decimal MaxPriceDefault = 1000000000000;


    }
}
