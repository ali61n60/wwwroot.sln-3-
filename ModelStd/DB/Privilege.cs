using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.DB
{

    [Table("Privilege")]
    public class Privilege
    {
        public Privilege()
        {
            AdPrivileges = new HashSet<AdPrivilege>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int privilegeId { get; set; }

        [Required]
        [StringLength(150)]
        public string privilegeName { get; set; }

       public virtual ICollection<AdPrivilege> AdPrivileges { get; set; }
    }
}
