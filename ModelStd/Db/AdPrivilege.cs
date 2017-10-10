using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db
{
   
    [Table("AdPrivilege")]
    public partial class AdPrivilege
    {
        [Key]
        [Column(Order = 0)]
        public Guid adId { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int privilegeId { get; set; }

        [Key]
        [Column(Order = 2, TypeName = "smalldatetime")]
        public DateTime insertionDate { get; set; }

        public virtual Advertisement Advertisement { get; set; }

        public virtual Privilege Privilege { get; set; }
    }
}
