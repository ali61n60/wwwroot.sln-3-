using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Price", Schema = "ad")]
    public partial class Price
    {
        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }

        [Column("priceType")]
        [MaxLength(150)]
        public string priceType { get; set; }

        [Column("price" , TypeName = "money")]
        [DataType(DataType.Currency)]
        public decimal? price { get; set; }

        public virtual Advertisements Ad { get; set; }
    }


    public partial class Price : IComparable<Price>
    {
        public static PriceType ParsePriceType(string s)
        {
            if (s == "فروشی")
                return PriceType.ForSale;
            if (s == "درخواستی")
                return PriceType.Request;
            return PriceType.All;
        }

        public static string ConverPriceTypeToString(PriceType priceType)
        {
            if (priceType == PriceType.ForSale)
                return "فروشی";
            if (priceType == PriceType.Request)
                return "درخواستی";
            return "همه";
        }


        public int CompareTo(Price other)
        {
            if (ReferenceEquals(this, other)) return 0;
            if (ReferenceEquals(null, other)) return 1;
            return Nullable.Compare(price, other.price);
        }
    }


    public enum PriceType
    {
        ForSale,
        Request,
        All
    }
}
