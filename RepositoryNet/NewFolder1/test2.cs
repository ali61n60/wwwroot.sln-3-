namespace RepositoryNet.NewFolder1
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class test2
    {
        public Guid id { get; set; }

        [Required]
        [StringLength(10)]
        public string name { get; set; }
    }
}
