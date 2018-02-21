using System;
using System.Collections.Generic;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    public interface IPrice//:IComparable<IPrice>
    {
        PriceType PriceType { get; }
        Guid AdId { get; set; }
        string PriceString { get;}
    }

    public enum PriceType
    {
        Fixed = 1,
        Agreement = 2,
        Exchange = 3,
        Installment = 4,
        MortgageAndRent = 5,
        All=6
    }

    public enum InstallmentPaymentPlan
    {
        OneMonthOne=1,
        TwoMonthsOne=2,
        ThreeMonthsOne =3,
        FourMonthsOne =4,
        FiveMonthsOne =5,
        SixMonthsOne = 6,
        SevenMonthsOne = 7,
        EightMonthsOne = 8,
        NineMonthsOne = 9,
        TenMonthsOne = 10,
        ElevenMonthsOne = 11,
        TwelveMonthsOne = 12
    }
}
