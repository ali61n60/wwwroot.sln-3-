using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using RepositoryStd.Context.Identity;
using System.Linq;
using ModelStd.Advertisements.Price;

namespace RepositoryStd.ModelConversion
{
    public class Convertor
    {
        public static void FillAdvertisementCommonFromAdvertisement(AdvertisementCommon adCommon, Advertisement ad,AppIdentityDbContext _appIdentityDbContext)
        {
            adCommon.AdId = ad.AdId;
            adCommon.UserId = ad.UserId;
            adCommon.AdTitle = ad.AdTitle;
            adCommon.AdTime = ad.AdInsertDateTime;
            adCommon.AdStatus = GetAdStatusString(ad.AdStatus);
            if (ad.Category != null) adCommon.CategoryName = ad.Category.CategoryName;
            adCommon.CategoryId = ad.CategoryId;
            adCommon.AdComments = ad.AdComments;
            adCommon.NumberOfVisit = ad.AdNumberOfVisited;
            adCommon.Email = _appIdentityDbContext.Users.First(user => user.Id == ad.UserId).Email;//TODO test for null
            adCommon.PhoneNumber = _appIdentityDbContext.Users.First(user => user.Id == ad.UserId).PhoneNumber;//TODO test for null
            adCommon.DistrictId = ad.DistrictId;
            if (ad.District != null) adCommon.DistrictName = ad.District.DistrictName;
            if (ad.District != null && ad.District.City != null) adCommon.CityName = ad.District.City.CityName;
            if (ad.District != null && ad.District.City != null && ad.District.City.Province != null)
                adCommon.ProvinceName = ad.District.City.Province.ProvinceName;

            fillAdvertisementPrice( adCommon, ad);
           

            adCommon.AdType = (ad.AdType == AdType.Offer) ? "ارائه" : "درخواستی";
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
