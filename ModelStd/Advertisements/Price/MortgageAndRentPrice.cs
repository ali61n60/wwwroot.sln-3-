using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    [Table("MortgageAndRentPrice", Schema = "ad")]
    public class MortgageAndRentPrice:IPrice
    {
        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }


        public PriceType PriceType { get; }

        public string PriceString => "قیمت" + " : " + "رهن" + " : " + Mortgage + " , کرایه ماهیانه" + " : " + RentPayMonth;

        [Column("mortgage", TypeName = "money")]
        [DataType(DataType.Currency)]
        public decimal Mortgage { get; set; }

        [Column("rentPayMonth", TypeName = "money")]
        [DataType(DataType.Currency)]
        public decimal RentPayMonth { get; set; }

        public MortgageAndRentPrice()
        {
            PriceType = PriceType.MortgageAndRent;
        }
    }
}
