namespace ModelStd.Advertisements
{
    
    public class AdvertisementTransportation:AdvertisementBase
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
        
        public string FuelName { 
            get { return FuelTypeName(); }
            set
            {
                string temp = value;
                switch (temp)
                {
                    case "گاز":
                        Fuel = FuelType.Gas;
                        break;
                    case "دیزل":
                        Fuel=FuelType.Disel;
                        break;
                    case "الکتریکی":
                        Fuel = FuelType.Electric;
                        break;
                    case "دوگانه سوز":
                        Fuel=FuelType.GasPetrol;
                        break;
                    case "بنزین":
                        Fuel=FuelType.Petrol;
                        break;
                    case "هیبرید":
                        Fuel=FuelType.Hybrid;
                        break;
                    default:
                    Fuel=FuelType.Petrol;
                        break;
                }
            }
        }
        
        private string FuelTypeName()
        {
            string fuelTypeName;
            switch (Fuel)
            {
                case FuelType.Gas:
                    fuelTypeName = "گاز";
                    break;
                case FuelType.Disel:
                    fuelTypeName = "دیزل";
                    break;
                case FuelType.Electric:
                    fuelTypeName = "الکتریکی";
                    break;
                case FuelType.GasPetrol:
                    fuelTypeName = "دوگانه سوز";
                    break;
                case FuelType.Petrol:
                    fuelTypeName = "بنزین";
                    break;
                case FuelType.Hybrid:
                    fuelTypeName = "هیبرید";
                    break;
                default:
                    fuelTypeName = "بنزین";
                    break;
            }
            return fuelTypeName;
        }
        
        public string BodyStatusName
        {
            get { return _BodyStatusName(); }
            set
            {
                string temp = value;
                switch (temp)
                {
                    case "بدون تصادف":
                        BodyStatus=BodyStatus.NoAccident;
                        break;
                    case "یک تصادف":
                        BodyStatus=BodyStatus.OneAccident;
                        break;
                    case "دو تصادف":
                        BodyStatus=BodyStatus.TwoAccident;
                        break;
                    default:
                        BodyStatus=BodyStatus.NoAccident;
                        break;
                }
            }
        }

        private string _BodyStatusName()
        {
            string bodyStatusName = "";
            switch (BodyStatus)
            {
                    case BodyStatus.NoAccident:
                    bodyStatusName = "بدون تصادف";
                    break;
                    case BodyStatus.OneAccident:
                    bodyStatusName = "یک تصادف";
                    break;
                    case BodyStatus.TwoAccident:
                    bodyStatusName = "دو تصادف";
                    break;
            }
            return bodyStatusName;
        }

       

    }
    
    
    public enum FuelType
    {
        Gas,
        Petrol,
        Disel,
        Electric,
        GasPetrol,
        Hybrid
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
