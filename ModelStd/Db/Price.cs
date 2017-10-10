using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace ModelStd.Db

{
   
    [Table("Price")]
    public partial class Price
    {
        [Key]
        public Guid adId { get; set; }

        [StringLength(150)]
        public string priceType { get; set; }

        [Column("price", TypeName = "money")]
        public decimal? price1 { get; set; }
        public virtual Advertisement Advertisement { get; set; }

       
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
            return Nullable.Compare(price1, other.price1);
        }
    }


    public enum PriceType
    {
        ForSale,
        Request,
        All
    }
}
