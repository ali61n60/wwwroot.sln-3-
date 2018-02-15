using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ModelStd.Advertisements;
using ModelStd.Advertisements.Price;
using ModelStd.Db.Identity;

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
        public virtual AgreementPrice AgreementPrice { get; set; }
        public virtual ExchangePrice ExchangePrice { get; set; }
        public virtual InstallmentPrice InsatllmentPrice { get; set; }
        public virtual MortgageAndRentPrice MortgageAndRentPrice { get; set; }
        public virtual ICollection<SimilarAds> SimilarAds { get; set; }
        public virtual Category Category { get; set; }
        public virtual District District { get; set; }
    }

    public partial class Advertisement
    {
        public static readonly string AdTypeKey = "AdType";
        public static readonly int AdTypeDefauly = 3;

        public static readonly string AdGuidKey = "AdGuid";

        public static void FillAdvertisementCommonFromAdvertisement(AdvertisementCommon adCommon, Advertisement ad, AppUser appUser)
        {
            adCommon.AdId = ad.AdId;
            adCommon.UserId = ad.UserId;
            adCommon.AdTitle = ad.AdTitle;
            adCommon.AdTime = ad.AdInsertDateTime;
            adCommon.AdStatus = GetAdStatusString(ad.AdStatus);
            if (ad.Category != null) adCommon.CategoryName = ad.Category.CategoryName;
            adCommon.CategoryId = ad.CategoryId;
            adCommon.AdComments = ad.AdComments;
            adCommon.NumberOfVisits = ad.AdNumberOfVisited;

            adCommon.Email = appUser?.Email;//test for null
            adCommon.PhoneNumber = appUser?.PhoneNumber;//test for null

            adCommon.DistrictId = ad.DistrictId;
            if (ad.District != null) adCommon.DistrictName = ad.District.DistrictName;
            if (ad.District?.City != null) adCommon.CityName = ad.District.City.CityName;
            if (ad.District?.City?.Province != null)
                adCommon.ProvinceName = ad.District.City.Province.ProvinceName;

            fillAdvertisementPrice(adCommon, ad);


            adCommon.AdType = (ad.AdType == Db.Ad.AdType.Offer) ? "ارائه" : "درخواستی";
        }

        private static void fillAdvertisementPrice(AdvertisementCommon adCommon, Advertisement ad)
        {
            switch (ad.PriceType)
            {
                case PriceType.Fixed:
                    adCommon.AdPrice = ad.FixedPrice;
                    break;
                case PriceType.Agreement:
                    adCommon.AdPrice = ad.AgreementPrice;
                    break;
                case PriceType.Exchange:
                    adCommon.AdPrice = ad.ExchangePrice;
                    break;
                case PriceType.Installment:
                    adCommon.AdPrice = ad.InsatllmentPrice;
                    break;
                case PriceType.MortgageAndRent:
                    adCommon.AdPrice = ad.MortgageAndRentPrice;
                    break;
                default:
                    adCommon.AdPrice = new AgreementPrice();
                    break;
            }
        }

        public static string GetAdStatusString(AdStatus adStatus)
        {
            switch (adStatus)
            {
                case Db.Ad.AdStatus.Submitted: return "ثبت شده";
                case Db.Ad.AdStatus.UnderReview: return "در حال بررسی";
                case Db.Ad.AdStatus.Approved: return "تایید شده";
                case Db.Ad.AdStatus.Rejected: return "رد شده";
                case Db.Ad.AdStatus.Expired: return "منقضی";
                case Db.Ad.AdStatus.ReSubmitted: return "ثبت دوباره";
                case Db.Ad.AdStatus.Deleted: return "حذف شده";
            }
            return "نا مشخص";
        }
    }

    public enum AdType
    {
        Offer = 1,
        Demand = 2,
        All=3
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
