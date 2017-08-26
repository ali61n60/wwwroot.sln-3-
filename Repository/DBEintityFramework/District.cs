namespace Repository.DBEintityFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class District
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public District()
        {
            Advertisements = new HashSet<Advertisement>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int districtId { get; set; }

        [Required]
        [StringLength(150)]
        public string districtName { get; set; }

        public int cityId { get; set; }

        public int? municipalId { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Advertisement> Advertisements { get; set; }

        public virtual City City { get; set; }
    }
}