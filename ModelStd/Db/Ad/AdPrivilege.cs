﻿using System;
using System.Collections.Generic;

namespace ModelStd.Db.Ad
{
    public partial class AdPrivilege
    {
        public Guid AdId { get; set; }
        public int PrivilegeId { get; set; }
        public DateTime InsertionDate { get; set; }

        public virtual Advertisements Ad { get; set; }
        public virtual Privilege Privilege { get; set; }
    }
}