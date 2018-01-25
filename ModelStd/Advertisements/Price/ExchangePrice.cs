using System;
using System.Collections.Generic;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    public class ExchangePrice:IPrice
    {
        public PriceType PriceType { get; }
        public Guid AdId { get; set; }
        public string PriceString { get; }

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
