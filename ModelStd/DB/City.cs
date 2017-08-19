using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.DB
{
    

    public partial class City
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public City()
        {
            Districts = new HashSet<District>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int cityId { get; set; }

        [Required]
        [StringLength(150)]
        public string cityName { get; set; }

        public int? provinceId { get; set; }

        public virtual Province Province { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<District> Districts { get; set; }
    }
}
