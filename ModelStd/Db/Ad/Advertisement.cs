using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ModelStd.Db.Ad
{
    [Table("Advertisements")]
    public  class Advertisement
    {
        public Advertisement()
        {
            //AdAttributeTransportations = new HashSet<AdAttributeTransportation>();
            AdPrivileges = new HashSet<AdPrivilege>();
            SimilarAds = new HashSet<SimilarAd>();
        }

        [Key]
        public Guid adId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public int categoryId { get; set; }
        [Required]
        public int districtId { get; set; }

        [Column(TypeName = "smalldatetime")]
        [Required]
        public DateTime adInsertDateTime { get; set; }

        [Required]
        [StringLength(500)]
        public string adLink { get; set; }

        [Required]
        public int adStatusId { get; set; }

        [Required]
        [StringLength(250)]
        public string adTitle { get; set; }

        [Required]
        [StringLength(1000)]
        public string adComments { get; set; }

        public int adNumberOfVisited { get; set; }

        public int WhatIsSheDoing { get; set; }

        
        //public virtual ICollection<AdAttributeTransportation> AdAttributeTransportations { get; set; }
        
        public virtual ICollection<AdPrivilege> AdPrivileges { get; set; }

        public virtual AdStatus AdStatus { get; set; }

        public virtual Category Category { get; set; }

        public virtual District District { get; set; }

        public virtual ICollection<SimilarAd> SimilarAds { get; set; }
    }
}
