using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using ModelStd.Db.Ad;

namespace ModelStd.Advertisements.Price
{
    [Table("ExchangePrice", Schema = "ad")]
    public class ExchangePrice:IPrice
    {
        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("Advertisements")]
        public Guid AdId { get; set; }

        public PriceType PriceType { get; }

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
