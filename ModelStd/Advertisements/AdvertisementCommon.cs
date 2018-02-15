using System;
using ModelStd.Advertisements.Price;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;

namespace ModelStd.Advertisements
{
    public class AdvertisementCommon
    {
        public AdvertisementCommon() : this(10) { }
        public AdvertisementCommon(int maxImageNumber)
        {
            AdImages=new string[maxImageNumber];
        }
        
        public Guid AdId { get; set; }
        
        public string UserId { get; set; }
        
        public string PhoneNumber { get; set; }
        
        public string Email { get; set; }
        
        public int CategoryId { get; set; }
        
        public string CategoryName { get; set; }
        
        public int DistrictId { get; set; }
        
        public string DistrictName { get; set; }
        
        public string CityName { get; set; }
        
        public string ProvinceName { get; set; }
        
        public DateTime AdTime { get; set; }
        
        public string AdStatus { get; set; }
        
        public string AdTitle { get; set; }
        
        public string AdComments { get; set; }
        
        public int NumberOfVisits { get; set; }
        
        public IPrice AdPrice { get; set; }
        
        public int AdPrivilegeId { get; set; } 
        
        public string[] AdImages { get; set; }

        public string AdType { get; set; }

        public static void FillAdvertisementCommonFromAdvertisement(AdvertisementCommon adCommon, Advertisement ad,AppUser appUser)
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
}