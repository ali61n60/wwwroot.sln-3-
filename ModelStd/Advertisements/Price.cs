using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ModelStd.Advertisements
{
    public class Price
    {
        public decimal price;
        public PriceType PriceType;

        public Price()
            : this(0, PriceType.ForSale)
        {

        }

        public Price(decimal price, PriceType priceType)
        {
            this.price = price;
            this.PriceType = priceType;
        }

        public string GetStringPriceType()
        {
            string temp = "";
            switch (PriceType)
            {
                    case PriceType.ForSale:
                    temp = "فروشی";
                    break;
                    case PriceType.ForExchange:
                    temp = "جهت معاوضه";
                    break;
            }
            return temp;
        }

        public void SetPriceTypeFromString(string stringPriceType)
        {
            this.PriceType=PriceType.ForSale;
            if (stringPriceType == "ForSale")
            {
                this.PriceType = PriceType.ForSale;
            }
            else if(stringPriceType=="ForExchange")
            {
                this.PriceType = PriceType.ForExchange;
            }
        }
    }
}
