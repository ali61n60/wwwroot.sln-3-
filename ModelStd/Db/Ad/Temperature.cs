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

        [Column("degree")]
        public double Degree { get; set; }

        [Column("humidity")]
        public double Humidity { get; set; }


        [Column("viewPoint")]
        public double ViewPoint { get; set; }


        [Column("insertDateTime", TypeName = "smalldatetime")]
        public DateTime InsertDateTime { get; set; }
    }
}
