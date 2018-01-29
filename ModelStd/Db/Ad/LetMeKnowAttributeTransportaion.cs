using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("LetMeKnowAttributeTransportaions", Schema = "ad")]
    public class LetMeKnowAttributeTransportaion
    {
        [Column("id")]
        [Key]
        [ForeignKey("LetMeKnow")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("modelId")]
        [Required]
        public int ModelId { get; set; }

        [Column("brandId")]
        [Required]
        public int BrandId { get; set; }

        public virtual LetMeKnow LetMeKnow { get; set; }
        public virtual Brand Brand { get; set; }
        public virtual CarModel CarModel { get; set; }
    }
}
