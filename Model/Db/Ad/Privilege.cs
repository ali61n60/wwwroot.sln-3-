namespace Model.Db.Ad
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ad.Privilege")]
    public partial class Privilege
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Privilege()
        {
            AdPrivileges = new HashSet<AdPrivilege>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int privilegeId { get; set; }

        [Required]
        [StringLength(150)]
        public string privilegeName { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AdPrivilege> AdPrivileges { get; set; }
    }
}
