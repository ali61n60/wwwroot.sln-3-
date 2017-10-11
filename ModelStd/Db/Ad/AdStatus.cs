using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
   
    [Table("AdStatus")]
    public  class AdStatus
    {
        public AdStatus()
        {
            //Advertisements = new HashSet<Advertisement>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int adStatusId { get; set; }

        [Required]
        [StringLength(150)]
        public string adStatus { get; set; }

        [Required]
        [StringLength(150)]
        public string adStatusEnglish { get; set; }

        //public virtual ICollection<Advertisement> Advertisements { get; set; }
    }
}
