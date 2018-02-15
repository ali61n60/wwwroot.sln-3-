using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ModelStd.Advertisements;
using ModelStd.Db.Identity;

namespace ModelStd.Db.Ad
{
    [Table("AdAttributeTransportations",Schema = "ad")]
    public partial class AdAttributeTransportation
    {
        [Column("adId")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid AdId { get; set; }

        [Column("modelId")]
        public int? ModelId { get; set; }

        [Column("makeYear")]
        public int? MakeYear { get; set; }

        [Column("fuelType")]
        public FuelType FuelType { get; set; }

        [Column("mileage")]
        public int? Mileage { get; set; }

        [Column("gearboxType")]
        public GearboxType GearboxType { get; set; }

        [Column("bodyColor")]
        [MaxLength(50)]
        public string BodyColor { get; set; }

        [Column("internalColor")]
        [MaxLength(50)]
        public string InternalColor { get; set; }

        [Column("bodyStatus")]
        public BodyStatus BodyStatus { get; set; }

        [Column("carStatus")]
        public CarStatus CarStatus { get; set; }

        [Column("plateType")]
        public PlateType PlateType { get; set; }

        public virtual Advertisement Ad { get; set; }
        public virtual CarModel CarModel { get; set; }
        
    }

    public partial class AdAttributeTransportation
    {
        public static void FillAdTransportationFromAdvertisement(AdvertisementTransportation adTrans, Advertisement advertisement, AppUser appUser)
        {
            Advertisement.FillAdvertisementCommonFromAdvertisement(adTrans, advertisement, appUser);
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

    public enum FuelType
    {
        Petrol=1,
        Disel=2,
        Gas=3,
        Electric=4,
        GasPetrol=5,
        Hybrid=6,
        UnSpecified=7
    }

    public enum GearboxType
    {
        Manual=1,
        Automatic=2,
        UnSpecified=3
    }



    public enum BodyStatus
    {
        NoColor=1,
        OnePieceColored=2,
        TwoPiecesColored=3,
        MultiPieceColored=4,
        BumperColored=5,
        BumperChanged=6,
        HoodColored=7,
        RoundColored=8,
        FullyColored=9,
        Accident=10,
        Scrap=11,
        BodyChanged=12,
        UnSpecified=13
    }

    public enum CarStatus
    {
        New=1,
        Used=2,
        Draft=3,
        UnSpecified=4
    }

    public enum PlateType
    {
        National=1,
        FreeRegion=2,
        Temporary=3,
        UnSpecified=4
    }
}
