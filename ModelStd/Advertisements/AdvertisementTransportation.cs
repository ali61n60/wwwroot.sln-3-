using ModelStd.Db.Ad;
using ModelStd.Db.Identity;

namespace ModelStd.Advertisements
{
    public class AdvertisementTransportation : AdvertisementCommon
    {
        public int ModelId;

        public string ModelName;

        public string BrandName;

        public int BrandId;

        public int MakeYear;

        public string Fuel;

        public int Mileage;

        public string Gearbox;

        public string BodyColor;

        public string InternalColor;

        public string BodyStatus;

        public string CarStatus;

        public string PlateType;

        public static void FillAdTransportationFromAdvertisement(AdvertisementTransportation adTrans,Advertisement advertisement,AppUser appUser)
        {
            AdvertisementCommon.FillAdvertisementCommonFromAdvertisement(adTrans, advertisement,appUser);
            adTrans.BodyColor = advertisement.AdAttributeTransportation.BodyColor;
            adTrans.BodyStatus = GetBodyStatusString(advertisement.AdAttributeTransportation.BodyStatus);
            adTrans.BrandId = advertisement.AdAttributeTransportation.CarModel.BrandId;
            adTrans.BrandName = advertisement.AdAttributeTransportation.CarModel.Brand.BrandName;
            adTrans.CarStatus = GetCarStatusString(advertisement.AdAttributeTransportation.CarStatus);
            adTrans.Fuel = GetFuelTypeString(advertisement.AdAttributeTransportation.FuelType);
            adTrans.Gearbox = GetGearboxTypeString(advertisement.AdAttributeTransportation.GearboxType);
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
            adTrans.PlateType = GetPlateTypeString(advertisement.AdAttributeTransportation.PlateType);
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
                case "NoColor": return Db.Ad.BodyStatus.NoColor;
                case "OnePieceColored": return Db.Ad.BodyStatus.OnePieceColored;
                case "TwoPiecesColored": return Db.Ad.BodyStatus.TwoPiecesColored;
                case "MultiPieceColored": return Db.Ad.BodyStatus.MultiPieceColored;
                case "BumperColored": return Db.Ad.BodyStatus.BumperColored;
                case "BumperChanged": return Db.Ad.BodyStatus.BumperChanged;
                case "HoodColored": return Db.Ad.BodyStatus.HoodColored;
                case "RoundColored": return Db.Ad.BodyStatus.RoundColored;
                case "FullyColored": return Db.Ad.BodyStatus.FullyColored;
                case "Accident": return Db.Ad.BodyStatus.Accident;
                case "Scrap": return Db.Ad.BodyStatus.Scrap;
                case "BodyChanged": return Db.Ad.BodyStatus.BodyChanged;
                case "UnSpecified": return Db.Ad.BodyStatus.UnSpecified;
            }
            return defaultValue;
        }

        public static string GetBodyStatusString(BodyStatus bodyStatus)
        {
            switch (bodyStatus)
            {
                case Db.Ad.BodyStatus.NoColor: return "NoColor";
                case Db.Ad.BodyStatus.OnePieceColored: return "OnePieceColored";
                case Db.Ad.BodyStatus.TwoPiecesColored: return "TwoPiecesColored";
                case Db.Ad.BodyStatus.MultiPieceColored: return "MultiPieceColored";
                case Db.Ad.BodyStatus.BumperColored: return "BumperColored";
                case Db.Ad.BodyStatus.BumperChanged: return "BumperChanged";
                case Db.Ad.BodyStatus.HoodColored: return "HoodColored";
                case Db.Ad.BodyStatus.RoundColored: return "RoundColored";
                case Db.Ad.BodyStatus.FullyColored: return "FullyColored";
                case Db.Ad.BodyStatus.Accident: return "Accident";
                case Db.Ad.BodyStatus.Scrap: return "Scrap";
                case Db.Ad.BodyStatus.BodyChanged: return "BodyChanged";
                case Db.Ad.BodyStatus.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

        public static CarStatus GetCarStatus(string carStatusString, CarStatus defaultValue)
        {
            switch (carStatusString)
            {
                case "New ": return Db.Ad.CarStatus.New;
                case "Used": return Db.Ad.CarStatus.Used;
                case "Draft": return Db.Ad.CarStatus.Draft;
                case "UnSpecified": return Db.Ad.CarStatus.UnSpecified;
            }

            return defaultValue;
        }

        public static string GetCarStatusString(CarStatus carStatus)
        {
            switch (carStatus)
            {
                case Db.Ad.CarStatus.New: return "New";
                case Db.Ad.CarStatus.Used: return "Used";
                case Db.Ad.CarStatus.Draft: return "Draft";
                case Db.Ad.CarStatus.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

        public static PlateType GetPlateType(string plateTypeString, PlateType defaultValue)
        {
            switch (plateTypeString)
            {
                case "National": return Db.Ad.PlateType.National;
                case "FreeRegion": return Db.Ad.PlateType.FreeRegion;
                case "Temporary": return Db.Ad.PlateType.Temporary;
                case "UnSpecified": return Db.Ad.PlateType.UnSpecified;
            }
            return defaultValue;
        }

        public static string GetPlateTypeString(PlateType plateType)
        {
            switch (plateType)
            {
                case Db.Ad.PlateType.National: return "National";
                case Db.Ad.PlateType.FreeRegion: return "FreeRegion";
                case Db.Ad.PlateType.Temporary: return "Temporary";
                case Db.Ad.PlateType.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

    }
}
