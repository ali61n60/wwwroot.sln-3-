using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using RepositoryStd.Context.Identity;
using System.Linq;

namespace RepositoryStd.ModelConversion
{
    public class Convertor
    {
        public static void FillAdvertisementCommonFromAdvertisement(AdvertisementCommon adCommon, Advertisement ad,AppIdentityDbContext _appIdentityDbContext)
        {
            adCommon.AdvertisementId = ad.AdId;
            adCommon.UserId = ad.UserId;
            adCommon.AdvertisementTitle = ad.AdTitle;
            adCommon.AdvertisementTime = ad.AdInsertDateTime;
            adCommon.AdvertisementStatus = GetAdStatusString(ad.AdStatus);
            if (ad.Category != null) adCommon.AdvertisementCategory = ad.Category.CategoryName;
            adCommon.AdvertisementCategoryId = ad.CategoryId;
            adCommon.AdvertisementComments = ad.AdComments;
            adCommon.NumberOfVisit = ad.AdNumberOfVisited;
            adCommon.Email = _appIdentityDbContext.Users.First(user => user.Id == ad.UserId).Email;//TODO test for null
            adCommon.PhoneNumber = _appIdentityDbContext.Users.First(user => user.Id == ad.UserId).PhoneNumber;//TODO test for null
            adCommon.DistrictId = ad.DistrictId;
            if (ad.District != null) adCommon.DistrictName = ad.District.DistrictName;
            if (ad.District != null && ad.District.City != null) adCommon.CityName = ad.District.City.CityName;
            if (ad.District != null && ad.District.City != null && ad.District.City.Province != null)
                adCommon.ProvinceName = ad.District.City.Province.ProvinceName;
            if (ad.FixedPrice != null) adCommon.AdvertisementPrice = ad.FixedPrice;//TODO based on ad.pricetype

            if (adCommon.AdvertisementPrice != null) adCommon.AdvertisementPrice.Ad = null;//prevent self referencing

            adCommon.AdType = (ad.AdType == AdType.Offer) ? "ارائه" : "درخواستی";
        }

        public static string GetAdStatusString(AdStatus adStatus)
        {
            switch (adStatus)
            {
                case AdStatus.Submitted: return "ثبت شده";
                case AdStatus.UnderReview: return "در حال بررسی";
                case AdStatus.Approved : return "تایید شده";
                case AdStatus.Rejected: return "رد شده";
                case AdStatus.Expired : return "منقضی";
                case AdStatus.ReSubmitted: return "ثبت دوباره";
                case AdStatus.Deleted: return "حذف شده";
            }
            return "نا مشخص";
        }
    }
}
