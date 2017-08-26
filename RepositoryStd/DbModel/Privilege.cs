using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Privilege
    {
        public Privilege()
        {
            AdPrivilege = new HashSet<AdPrivilege>();
        }

        public int PrivilegeId { get; set; }
        public string PrivilegeName { get; set; }

        public virtual ICollection<AdPrivilege> AdPrivilege { get; set; }
    }
}
