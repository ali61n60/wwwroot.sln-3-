using System;
using System.Collections.Generic;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    class FixedPrice:IPrice
    {
        public PriceType PriceType { get; private set; }
        public double PriceAmount { get; set; }

        public FixedPrice(double priceAmount)
        {
            PriceType = PriceType.Fixed;
            PriceAmount = priceAmount;
        }

        public override string ToString()
        {
            return "قیمت" + " : " + PriceAmount;
        }
    }
}
