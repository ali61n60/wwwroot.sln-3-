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
            adCommon.AdvertisementStatusId = ad.AdStatusId;
            if (ad.AdStatus != null) adCommon.AdvertisementStatus = ad.AdStatus.AdStatus1;
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
            if (ad.Price != null) adCommon.AdvertisementPrice = ad.Price;

            if (adCommon.AdvertisementPrice != null) adCommon.AdvertisementPrice.Ad = null;//prevent self referencing

            adCommon.AdType = (ad.AdType == AdType.Offer) ? "ارائه" : "درخواستی";
        }
    }
}
