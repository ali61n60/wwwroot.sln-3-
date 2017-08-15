namespace RepositoryNet.NewFolder1
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class AdStatu
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AdStatu()
        {
            Advertisements = new HashSet<Advertisement>();
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Advertisement> Advertisements { get; set; }
    }
}
