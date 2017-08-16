using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RepositoryStd.DB
{
    
    [Table("CarModel")]
    public partial class CarModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int modelId { get; set; }

        [Required]
        [StringLength(150)]
        public string modelName { get; set; }

        public int brandId { get; set; }
        
        [ForeignKey("brandId")]
        public virtual Brand Brand { get; set; }
    }
}
