using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ModelStd.Db.Ad
{
    [Table("LetMeKnowAttributeTransportaion", Schema = "ad")]
    public class LetMeKnowAttributeTransportaion
    {
        [Column("id")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("modelId")]
        public int? ModelId { get; set; }

        [Column("brandId")]
        public int? BrandId { get; set; }
    }
}
