namespace Repository.DBEintityFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class MobileBrand
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int brandId { get; set; }

        [Required]
        [StringLength(150)]
        public string brandName { get; set; }

        public int brandMakerId { get; set; }
    }
}