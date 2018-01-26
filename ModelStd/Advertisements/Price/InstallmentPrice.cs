using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    [Table("InstallmentPrice", Schema = "ad")]
    public class InstallmentPrice:IPrice
    {
        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }


        public PriceType PriceType { get; }

        public string PriceString { get; }

        [Column("prepayment", TypeName = "money")]
        [DataType(DataType.Currency)]
        public decimal Prepayment { get; set; }

        [Column("numberOfInstallments")]
        public int NumberOfInstallments { get; set; }

        [Column("PayPerInstallment", TypeName = "money")]
        [DataType(DataType.Currency)]
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
