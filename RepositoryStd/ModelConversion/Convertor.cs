using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using RepositoryStd.Context.Identity;
using System.Linq;

namespace RepositoryStd.ModelConversion
{
    public class Convertor
    {
        public static void FillAdvertisementCommonFromAdvertisement(AdvertisementCommon adCommon, Advertisement advertisement,AppIdentityDbContext _appIdentityDbContext)
        {
            adCommon.AdvertisementId = advertisement.AdId;
            adCommon.UserId = advertisement.UserId;
            adCommon.AdvertisementTitle = advertisement.AdTitle;
            adCommon.AdvertisementTime = advertisement.AdInsertDateTime;
            adCommon.AdvertisementStatusId = advertisement.AdStatusId;
            if (advertisement.AdStatus != null) adCommon.AdvertisementStatus = advertisement.AdStatus.AdStatus1;
            if (advertisement.Category != null) adCommon.AdvertisementCategory = advertisement.Category.CategoryName;
            adCommon.AdvertisementCategoryId = advertisement.CategoryId;
            adCommon.AdvertisementComments = advertisement.AdComments;
            adCommon.NumberOfVisit = advertisement.AdNumberOfVisited;
            adCommon.Email = _appIdentityDbContext.Users.First(user => user.Id == advertisement.UserId).Email;//TODO test for null
            adCommon.PhoneNumber = _appIdentityDbContext.Users.First(user => user.Id == advertisement.UserId).PhoneNumber;//TODO test for null
            adCommon.DistrictId = advertisement.DistrictId;
            if (advertisement.District != null) adCommon.DistrictName = advertisement.District.DistrictName;
            if (advertisement.District != null && advertisement.District.City != null) adCommon.CityName = advertisement.District.City.CityName;
            if (advertisement.District != null && advertisement.District.City != null && advertisement.District.City.Province != null)
                adCommon.ProvinceName = advertisement.District.City.Province.ProvinceName;
            if (advertisement.Price != null) adCommon.AdvertisementPrice = advertisement.Price;

            if (adCommon.AdvertisementPrice != null) adCommon.AdvertisementPrice.Ad = null;//prevent self referencing
        }
    }
}
