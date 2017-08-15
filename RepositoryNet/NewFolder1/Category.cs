namespace RepositoryNet.NewFolder1
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Category
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Category()
        {
            Advertisements = new HashSet<Advertisement>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int categoryId { get; set; }

        [Required]
        [StringLength(150)]
        public string categoryName { get; set; }

        [StringLength(10)]
        public string categoryParentId { get; set; }

        [StringLength(150)]
        public string categoryNameEnglish { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Advertisement> Advertisements { get; set; }
    }
}
