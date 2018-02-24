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
        public static readonly string CarModelIdKey = "CarModelId";
        public static readonly int CarModelIdDefault = 0;

        public static readonly string CarBrandIdKey = "BrandId";
        public static readonly int CarBrandIdDefault = 0;

        public static readonly string MakeYearFromKey = "MakeYearFrom";
        public static readonly int MakeYearFromDefault = 0;

        public static readonly string MakeYearToKey = "MakeYearTo";
        public static readonly int MakeYearToDefault = 1400;

        public static readonly string MakeYearKey = "MakeYear";
        public static readonly int MakeYearDefault = 0;

        public static readonly string FuelTypeKey = "Fuel";
        public static readonly FuelType FuelTypeDefault = FuelType.UnSpecified;

        public static readonly string MileageFromKey = "MileageFrom";
        public static readonly int MileageFromDefault = 0;

        public static readonly string MileageToKey = "MileageTo";
        public static readonly int MileageToDefault = 100000000;

        public static readonly string MileageKey = "Mileage";
        public static readonly int MileageDefault = 0;

        public static readonly string GearboxKey = "Gearbox";
        public static readonly GearboxType GearboxDefault = GearboxType.UnSpecified;

        public static readonly string BodyColorKey = "BodyColor";
        public static readonly string BodyColorDefault = "UnSpecified";

        public static readonly string InternalColorKey = "InternalColor";
        public static readonly string InternalColorDefault = "UnSpecified";

        public static readonly string BodyStatusKey = "BodyStatus";
        public static readonly BodyStatus BodyStatusDefault = BodyStatus.UnSpecified;

        public static readonly string CarStatusKey = "CarStatus";
        public static readonly CarStatus CarStatusDefault = CarStatus.UnSpecified;

        public static readonly string PlateTypeKey = "PlateType";

        public static readonly PlateType PlateTypeDefault = PlateType.UnSpecified;


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
                case FuelType.Petrol: return "بنزین";
                case FuelType.Disel: return "دیزل";
                case FuelType.Gas: return "گاز";
                case FuelType.GasPetrol: return "دوگانه بنزین/گاز";
                case FuelType.Electric: return "برقی";
                case FuelType.Hybrid: return "هیبرید";
                case FuelType.UnSpecified: return "نامشخص";
            }
            return "نامشخص";
        }

       
        public static string GetGearboxTypeString(GearboxType gearboxType)
        {
            switch (gearboxType)
            {
                case GearboxType.Manual: return "دستی";
                case GearboxType.Automatic: return "اتوماتیک";
                case GearboxType.UnSpecified: return "نامشخص";
            }
            return "نامشخص";
        }

       
        public static string GetBodyStatusString(BodyStatus bodyStatus)
        {
            switch (bodyStatus)
            {
                case BodyStatus.NoColor: return "بدون رنگ";
                case BodyStatus.OnePieceColored: return "یک تکه رنگ";
                case BodyStatus.TwoPiecesColored: return "دو تکه رنگ";
                case BodyStatus.MultiPieceColored: return "چند تکه رنگ";
                case BodyStatus.BumperColored: return "کاپوت رنگ";
                case BodyStatus.BumperChanged: return "کاپوت تعویض";
                case BodyStatus.HoodColored: return "صندوق رنگ";
                case BodyStatus.RoundColored: return "دور رنگ";
                case BodyStatus.FullyColored: return "کامل رنگ";
                case BodyStatus.Accident: return "تصادفی";
                case BodyStatus.Scrap: return "اوراقی";
                case BodyStatus.BodyChanged: return "بدنه تعویض";
                case BodyStatus.UnSpecified: return "نامشخص";
            }
            return "نامشخص";
        }

        
        public static string GetCarStatusString(CarStatus carStatus)
        {
            switch (carStatus)
            {
                case CarStatus.New: return "صفر";
                case CarStatus.Used: return "کارکرده";
                case CarStatus.Draft: return "حواله";
                case CarStatus.UnSpecified: return "نامشخص";
            }
            return "نامشخص";
        }

        

        public static string GetPlateTypeString(PlateType plateType)
        {
            switch (plateType)
            {
                case PlateType.National: return "ملی";
                case PlateType.FreeRegion: return "منطقه آزاد";
                case PlateType.Temporary: return "عبور موقت";
                case PlateType.UnSpecified: return "نامشخص";
            }
            return "نامشخص";
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
