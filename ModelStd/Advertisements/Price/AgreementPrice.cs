using System;
using System.Collections.Generic;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    public class AgreementPrice:IPrice
    {
        public PriceType PriceType { get; }
        public Guid AdId { get; set; }

        public AgreementPrice()
        {
            PriceType = PriceType.Agreement;
        }
        public override string ToString()
        {
            return "قیمت" + " : " + "توافقی";
        }
        public virtual Advertisement Ad { get; set; }
    }
}
