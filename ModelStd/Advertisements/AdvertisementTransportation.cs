namespace ModelStd.Advertisements
{

    public class AdvertisementTransportation : AdvertisementBase
    {
        public int ModelId;

        public string ModelName;

        public string BrandName;

        public int BrandId;

        public int MakeYear;

        public FuelType Fuel;

        public int Mileage;

        public string Gearbox;

        public string BodyColor;

        public string InternalColor;

        public BodyStatus BodyStatus;

        public CarStatus CarStatus;

        public PlateType PlateType;

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

        public static FuelType GetFuelType(string fuelTypeString,FuelType defaultValue)
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
        public void SetBodyStatus(string bodyStatus)
        {
            switch (bodyStatus)
            {
                case "NoAccident":
                    this.BodyStatus = BodyStatus.NoAccident;
                    break;
                case "OneAccident":
                    this.BodyStatus = BodyStatus.OneAccident;
                    break;
                case "TwoAccident":
                    this.BodyStatus = BodyStatus.TwoAccident;
                    break;
                default:
                    this.BodyStatus = BodyStatus.NoAccident;
                    break;
            }
        }


        public static BodyStatus GetBodyStatus(string bodyStatusString, BodyStatus defaultValue)
        {
            switch (bodyStatusString)
            {
                case "NoAccident": return BodyStatus.NoAccident;
                case "OneAccident": return BodyStatus.OneAccident;
                case "TwoAccidents": return BodyStatus.TwoAccidents;
                case "UnSpecified": return BodyStatus.UnSpecified;
            }
            return defaultValue;
        }

        public static string GetBodyStatusString(BodyStatus bodyStatus)
        {
            switch (bodyStatus)
            {
                case BodyStatus.NoAccident: return "NoAccident";
                case BodyStatus.OneAccident: return "OneAccident";
                case BodyStatus.TwoAccidents: return "TwoAccidents";
                case BodyStatus.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }
    }


    public enum FuelType
    {
        Petrol,
        Disel,
        Gas,
        Electric,
        GasPetrol,
        Hybrid,
        UnSpecified
    }

    public enum GearboxType
    {
        Manual,
        Automatic,
        UnSpecified
    }

    public enum BodyStatus
    {
        NoAccident,
        OneAccident,
        TwoAccidents,
        UnSpecified
    }

    public enum CarStatus
    {
        New,
        Used,
        Draft,
        UnSpecified
    }

    public enum PlateType
    {
        National,
        FreeRegion,
        Temporary,
        UnSpecified
    }
}
