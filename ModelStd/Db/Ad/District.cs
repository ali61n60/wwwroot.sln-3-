﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Districts",Schema = "ad")]
    public class District
    {
        public District()
        {
            Advertisements = new HashSet<Advertisement>();
        }

        [Key]
        [Column("districtId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int DistrictId { get; set; }

        [Column("districtName")]
        [Required]
        [MaxLength(150)]
        public string DistrictName { get; set; }

        [Column("cityId")]
        [Required]
        public int CityId { get; set; }

        [Column("municipalId")]
        public int? MunicipalId { get; set; }

        public virtual ICollection<Advertisement> Advertisements { get; set; }
        public virtual City City { get; set; }
    }
}
