namespace Repository.DBEintityFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Advertisement
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Advertisement()
        {
            AdAttributeTransportations = new HashSet<AdAttributeTransportation>();
            AdPrivileges = new HashSet<AdPrivilege>();
            SimilarAds = new HashSet<SimilarAd>();
        }

        [Key]
        public Guid adId { get; set; }

        public Guid UserId { get; set; }

        public int categoryId { get; set; }

        public int districtId { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime adInsertDateTime { get; set; }

        [Required]
        [StringLength(500)]
        public string adLink { get; set; }

        public int adStatusId { get; set; }

        [Required]
        [StringLength(250)]
        public string adTitle { get; set; }

        [Required]
        [StringLength(1000)]
        public string adComments { get; set; }

        public int adNumberOfVisited { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AdAttributeTransportation> AdAttributeTransportations { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AdPrivilege> AdPrivileges { get; set; }

        public virtual AdStatu AdStatu { get; set; }

        public virtual aspnet_Users aspnet_Users { get; set; }

        public virtual Category Category { get; set; }

        public virtual District District { get; set; }

        public virtual Price Price { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SimilarAd> SimilarAds { get; set; }
    }
}