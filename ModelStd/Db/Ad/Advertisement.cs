using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ModelStd.Advertisements.Price;

namespace ModelStd.Db.Ad
{
    [Table("Advertisements", Schema = "ad")]
    public partial class Advertisement
    {
        public Advertisement()
        {
            AdPrivilege = new HashSet<AdPrivilege>();
            SimilarAds = new HashSet<SimilarAds>();
            MarkedAds = new HashSet<MarkedAd>();
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

        [Column("adInsertDateTime", TypeName = "smalldatetime")]
        public DateTime AdInsertDateTime { get; set; }

        [Column("adLink")]
        [Required]
        [MaxLength(500)]
        public string AdLink { get; set; }

        [Column("adStatus")]
        public AdStatus AdStatus { get; set; }

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

        [Column("adType")]
        [Required]
        public AdType AdType { get; set; }

        [Column("priceType")]
        [Required]
        public PriceType PriceType { get; set; }

        public virtual AdAttributeTransportation AdAttributeTransportation { get; set; }
        public virtual ICollection<AdPrivilege> AdPrivilege { get; set; }
        public virtual ICollection<MarkedAd> MarkedAds { get; set; }
        public virtual FixedPrice FixedPrice { get; set; }
        public virtual ICollection<SimilarAds> SimilarAds { get; set; }
        public virtual Category Category { get; set; }
        public virtual District District { get; set; }
    }

    public partial class Advertisement
    {
        public static readonly string AdTypeKey = "AdType";
        public static readonly int AdTypeDefauly = 2;
    }

    public enum AdType
    {
        Offer = 1,
        Demand = 2,
        OfferOrDemand=3
    }

    
    public enum AdStatus
    {
        Submitted = 1,//ثبت شده
        UnderReview = 2,//در حال بررسی
        Approved = 3,//تایید شده
        Rejected = 4,//رد شده
        Expired = 5,//منقضی
        ReSubmitted = 6,//ثبت دوباره
        Deleted = 7//حذف شده
    }

    public enum Privilege
    {
        NoPrivilege=1,
        Urgent=2,
        EmailOthers=3,
        SmsOthers=4
    }
}
