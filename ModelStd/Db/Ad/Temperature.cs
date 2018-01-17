using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Temperatures", Schema = "ad")]
    public class Temperature
    {
        [Key]
        [Column("temperatureId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TemperatureId { get; set; }

        [Column("temp")]
        public int Temp { get; set; }

        [Column("insertDateTime", TypeName = "smalldatetime")]
        public DateTime InsertDateTime { get; set; }
    }
}
