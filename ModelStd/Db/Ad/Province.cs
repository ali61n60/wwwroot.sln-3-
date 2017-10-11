using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    

    [Table("Provinces")]
    public partial class Province
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Province()
        {
            Cities = new HashSet<City>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int provinceId { get; set; }

        [Required]
        [StringLength(150)]
        public string provinceName { get; set; }

        [StringLength(150)]
        public string provinceCenter { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<City> Cities { get; set; }
    }
}
