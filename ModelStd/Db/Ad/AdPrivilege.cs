using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("AdPrivilege",Schema = "ad")]
    public class AdPrivilege
    {
        
        [Column("adId")]
        public Guid AdId { get; set; }

        [Column("privilegeId")]
        public int PrivilegeId { get; set; }

        [Column("insertionDate",TypeName = "smalldatetime")]
        public DateTime InsertionDate { get; set; }

        public virtual Advertisement Ad { get; set; }
        public virtual Privilege Privilege { get; set; }
    }
}
