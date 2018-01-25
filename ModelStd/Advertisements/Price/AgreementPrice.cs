using System;
using System.Collections.Generic;
using System.Text;

namespace ModelStd.Advertisements.Price
{
    public class AgreementPrice:IPrice
    {
        public PriceType PriceType { get; }

        public AgreementPrice()
        {
            PriceType = PriceType.Agreement;
        }
    }
}
