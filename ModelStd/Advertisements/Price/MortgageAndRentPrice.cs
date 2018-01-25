using System;
using System.Collections.Generic;
using System.Text;

namespace ModelStd.Advertisements.Price
{
    public class MortgageAndRentPrice:IPrice
    {
        public PriceType PriceType { get; }

        public double Mortgage { get; set; }
        public double RentPayMonth { get; set; }

        public MortgageAndRentPrice()
        {
            PriceType = PriceType.MortgageAndRent;
        }
    }
}
