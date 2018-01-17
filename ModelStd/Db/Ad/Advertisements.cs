using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("Advertisements", Schema = "ad")]
    public class Advertisements
    {
        public Advertisements()
        {
            AdPrivilege = new HashSet<AdPrivilege>();
            SimilarAds = new HashSet<SimilarAds>();
            MarkedAds=new HashSet<MarkedAd>();
        }

        [Key]
        [Column("adId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid AdId { get; set; }

        [Column("UserId")]
        [MaxLength(200)]
        public string UserId { get; set; }

        [Column("categoryId")]
        public int CategoryId { get; set; }

        [Column("districtId")]
        public int DistrictId { get; set; }

        [Column("adInsertDateTime",TypeName = "smalldatetime")]
        public DateTime AdInsertDateTime { get; set; }

        [Column("adLink")]
        [Required]
        [MaxLength(500)]
        public string AdLink { get; set; }

        [Column("adStatusId")]
        public int AdStatusId { get; set; }


        [Column("adTitle")]
        [Required]
        [MaxLength(250)]
        public string AdTitle { get; set; }

        [Column("adComments")]
        [Required]
        [MaxLength(1000)]
        public string AdComments { get; set; }

        [Column("adNumberOfVisited")]
        public int AdNumberOfVisited { get; set; }

        public virtual AdAttributeTransportation AdAttributeTransportation { get; set; }
        public virtual ICollection<AdPrivilege> AdPrivilege { get; set; }
        public virtual ICollection<MarkedAd> MarkedAds { get; set; }
        public virtual Price Price { get; set; }
        public virtual ICollection<SimilarAds> SimilarAds { get; set; }
        public virtual AdStatus AdStatus { get; set; }
        public virtual Categories Category { get; set; }
        public virtual District District { get; set; }
    }
}
