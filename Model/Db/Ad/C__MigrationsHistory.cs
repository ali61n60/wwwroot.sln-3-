namespace Model.Db.Ad
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ad.__MigrationsHistory")]
    public partial class C__MigrationsHistory
    {
        [Key]
        [StringLength(150)]
        public string MigrationId { get; set; }

        [Required]
        [StringLength(32)]
        public string ProductVersion { get; set; }
    }
}
