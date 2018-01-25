using System;
using System.Collections.Generic;
using System.Text;

namespace ModelStd.Advertisements.Price
{
    public class ExchangePrice:IPrice
    {
        public PriceType PriceType { get; }

        public ExchangePrice()
        {
            PriceType = PriceType.Exchange;
        }
        public override string ToString()
        {
            return "قیمت" + " : " + "تعویض";
        }
    }
}
