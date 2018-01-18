using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("AdPrivilege",Schema = "ad")]
    public partial class AdPrivilege
    {
        
        [Column("adId")]
        public Guid AdId { get; set; }

        [Column("privilegeId")]
        public int PrivilegeId { get; set; }

        [Column("insertionDate",TypeName = "smalldatetime")]
        public DateTime InsertionDate { get; set; }

        public virtual Advertisements Ad { get; set; }
        public virtual Privilege Privilege { get; set; }
    }
}
