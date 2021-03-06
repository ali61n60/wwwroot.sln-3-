﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ModelStd.Db.Identity;

namespace ModelStd.Db.Ad
{
    [Table("MarkedA", Schema = "ad")]
    public class MarkedAd
    {
        
        [Column("adId")]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid AdId { get; set; }

        [Column("userId")]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string UserId { get; set; }

        public virtual Advertisement Ad { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
