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

        public static string GetFuelName(FuelType fuelType)
        {
            switch (fuelType)
            {
                case FuelType.Petrol: return "Pertrol";
                case FuelType.Disel: return "Disel";
                case FuelType.Gas: return "Gas";
                case FuelType.GasPetrol: return "GasPetrol";
                case FuelType.Electric: return "Electric";
                case FuelType.Hybrid: return "Hybrid";
                case FuelType.UnSpecified: return "UnSpecified";
            }
            return "UnSpecified";
        }

        public static FuelType GetFuelType(string fuelTypeString)
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
            return FuelType.UnSpecified;
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
        Automatic
    }

    public enum BodyStatus
    {
        NoAccident,
        OneAccident,
        TwoAccident
    }

    public enum CarStatus
    {
        New,
        Used,
        Draft
    }

    public enum PlateType
    {
        National,
        FreeRegion,
        Temporary
    }
}
