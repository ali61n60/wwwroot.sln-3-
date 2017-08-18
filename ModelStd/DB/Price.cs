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

    public partial class Price
    {
        public static PriceType ParsePriceType(string s)
        {
            if(s=="فروشی")
                return PriceType.ForSale;
            if(s=="درخواستی")
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
    }

    public enum PriceType
    {
        ForSale,
        Request,
        All
    }


   
}
