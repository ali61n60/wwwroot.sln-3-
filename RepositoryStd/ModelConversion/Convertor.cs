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
            adCommon.NumberOfVisits = ad.AdNumberOfVisited;
            adCommon.Email = _appIdentityDbContext.Users.First(user => user.Id == ad.UserId).Email;//TODO test for null
            adCommon.PhoneNumber = _appIdentityDbContext.Users.First(user => user.Id == ad.UserId).PhoneNumber;//TODO test for null
            adCommon.DistrictId = ad.DistrictId;
            if (ad.District != null) adCommon.DistrictName = ad.District.DistrictName;
            if (ad.District?.City != null) adCommon.CityName = ad.District.City.CityName;
            if (ad.District?.City?.Province != null)
                adCommon.ProvinceName = ad.District.City.Province.ProvinceName;

            fillAdvertisementPrice( adCommon, ad);
           

            adCommon.AdType = (ad.AdType == AdType.Offer) ? "ارائه" : "درخواستی";
        }


        public static void FillAdTransportationFromAdvertisement(AdvertisementTransportation adTrans,
            Advertisement advertisement, AppIdentityDbContext _appIdentityDbContext)
        {
            Convertor.FillAdvertisementCommonFromAdvertisement(adTrans, advertisement, _appIdentityDbContext);
            adTrans.BodyColor = advertisement.AdAttributeTransportation.BodyColor;
            adTrans.BodyStatus = Convertor.GetBodyStatusString(advertisement.AdAttributeTransportation.BodyStatus);
            adTrans.BrandId = advertisement.AdAttributeTransportation.CarModel.BrandId;
            adTrans.BrandName = advertisement.AdAttributeTransportation.CarModel.Brand.BrandName;
            adTrans.CarStatus = Convertor.GetCarStatusString(advertisement.AdAttributeTransportation.CarStatus);
            adTrans.Fuel = Convertor.GetFuelTypeString(advertisement.AdAttributeTransportation.FuelType);
            adTrans.Gearbox = Convertor.GetGearboxTypeString(advertisement.AdAttributeTransportation.GearboxType);
            adTrans.InternalColor = advertisement.AdAttributeTransportation.InternalColor;

            if (advertisement.AdAttributeTransportation.MakeYear != null)
                adTrans.MakeYear = advertisement.AdAttributeTransportation.MakeYear.Value;
            else
                adTrans.MakeYear = -1;

            if (advertisement.AdAttributeTransportation.Mileage != null)
                adTrans.Mileage = advertisement.AdAttributeTransportation.Mileage.Value;
            else
                adTrans.Mileage = -1;

            adTrans.ModelId = advertisement.AdAttributeTransportation.CarModel.ModelId;
            adTrans.ModelName = advertisement.AdAttributeTransportation.CarModel.ModelName;
            adTrans.PlateType = Convertor.GetPlateTypeString(advertisement.AdAttributeTransportation.PlateType);
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

        public static string GetFuelTypeString(FuelType fuelType)
        {
            switch (fuelType)
            {
                case FuelType.Petrol: return "Petrol";
                case FuelType.Disel: return "Disel";
                case FuelType.Gas: return "Gas";
                case FuelType.GasPetrol: return "GasPetrol";
                case FuelType.Electric: return "Electric";
                case FuelType.Hybrid: return "Hybrid";
                case FuelType.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

        public static FuelType GetFuelType(string fuelTypeString, FuelType defaultValue)
        {
            switch (fuelTypeString)
            {
                case "Petrol": return FuelType.Petrol;
                case "Disel": return FuelType.Disel;
                case "Gas": return FuelType.Gas;
                case "GasPetrol": return FuelType.GasPetrol;
                case "Electric": return FuelType.Electric;
                case "Hybrid": return FuelType.Hybrid;
            }
            return defaultValue;
        }

        public static string GetGearboxTypeString(GearboxType gearboxType)
        {
            switch (gearboxType)
            {
                case GearboxType.Manual: return "Manual";
                case GearboxType.Automatic: return "Automatic";
                case GearboxType.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

        public static GearboxType GetGearboxType(string gearboxTypeString, GearboxType dedaultValue)
        {
            switch (gearboxTypeString)
            {
                case "Manual": return GearboxType.Manual;
                case "Automatic": return GearboxType.Automatic;
                case "UnSpecified": return GearboxType.UnSpecified;
            }
            return dedaultValue;
        }

        public static BodyStatus GetBodyStatus(string bodyStatusString, BodyStatus defaultValue)
        {
            switch (bodyStatusString)
            {
                case "NoColor": return BodyStatus.NoColor;
                case "OnePieceColored": return BodyStatus.OnePieceColored;
                case "TwoPiecesColored": return BodyStatus.TwoPiecesColored;
                case "MultiPieceColored": return BodyStatus.MultiPieceColored;
                case "BumperColored": return BodyStatus.BumperColored;
                case "BumperChanged": return BodyStatus.BumperChanged;
                case "HoodColored": return BodyStatus.HoodColored;
                case "RoundColored": return BodyStatus.RoundColored;
                case "FullyColored": return BodyStatus.FullyColored;
                case "Accident": return BodyStatus.Accident;
                case "Scrap": return BodyStatus.Scrap;
                case "BodyChanged": return BodyStatus.BodyChanged;
                case "UnSpecified": return BodyStatus.UnSpecified;
            }
            return defaultValue;
        }

        public static string GetBodyStatusString(BodyStatus bodyStatus)
        {
            switch (bodyStatus)
            {
                case BodyStatus.NoColor: return "NoColor";
                case BodyStatus.OnePieceColored: return "OnePieceColored";
                case BodyStatus.TwoPiecesColored: return "TwoPiecesColored";
                case BodyStatus.MultiPieceColored: return "MultiPieceColored";
                case BodyStatus.BumperColored: return "BumperColored";
                case BodyStatus.BumperChanged: return "BumperChanged";
                case BodyStatus.HoodColored: return "HoodColored";
                case BodyStatus.RoundColored: return "RoundColored";
                case BodyStatus.FullyColored: return "FullyColored";
                case BodyStatus.Accident: return "Accident";
                case BodyStatus.Scrap: return "Scrap";
                case BodyStatus.BodyChanged: return "BodyChanged";
                case BodyStatus.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

        public static CarStatus GetCarStatus(string carStatusString, CarStatus defaultValue)
        {
            switch (carStatusString)
            {
                case "New ": return CarStatus.New;
                case "Used": return CarStatus.Used;
                case "Draft": return CarStatus.Draft;
                case "UnSpecified": return CarStatus.UnSpecified;
            }

            return defaultValue;
        }

        public static string GetCarStatusString(CarStatus carStatus)
        {
            switch (carStatus)
            {
                case CarStatus.New: return "New";
                case CarStatus.Used: return "Used";
                case CarStatus.Draft: return "Draft";
                case CarStatus.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

        public static PlateType GetPlateType(string plateTypeString, PlateType defaultValue)
        {
            switch (plateTypeString)
            {
                case "National": return PlateType.National;
                case "FreeRegion": return PlateType.FreeRegion;
                case "Temporary": return PlateType.Temporary;
                case "UnSpecified": return PlateType.UnSpecified;
            }
            return defaultValue;
        }

        public static string GetPlateTypeString(PlateType plateType)
        {
            switch (plateType)
            {
                case PlateType.National: return "National";
                case PlateType.FreeRegion: return "FreeRegion";
                case PlateType.Temporary: return "Temporary";
                case PlateType.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }
    }
}
