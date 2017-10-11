using System;
using System.Collections.Generic;

namespace ModelStd.Db.Ad
{
    public partial class Price
    {
        public Guid AdId { get; set; }
        public string priceType { get; set; }
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
