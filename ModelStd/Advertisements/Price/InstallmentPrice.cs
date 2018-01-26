﻿using System;
using System.Collections.Generic;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    public class InstallmentPrice:IPrice
    {
        public PriceType PriceType { get; }
        public Guid AdId { get; set; }
        public string PriceString { get; }

        public decimal Prepayment { get; set; }
        public int NumberOfInstallments { get; set; }
        public decimal PayPerInstallment { get; set; }
        public InstallmentPaymentPlan Plan { get; set; }

        public InstallmentPrice()
        {
            PriceType = PriceType.Installment;
        }
        public override string ToString()
        {
            return "قیمت" + " : " + "پیش پرداخت"+ " : "+Prepayment+" , تعداد اقساط"+" : "+NumberOfInstallments;
        }
    }
}