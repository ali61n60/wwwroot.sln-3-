using System;

namespace Repository.QueryPattern
{
    public class ProperyNameColumnName
    {
        private ProperyNameColumnName(string columnName,string propertyName)
        {
            ColumnName = columnName;
            PropertyNameString = propertyName;
        }
        public string ColumnName { get; internal set; }
        public string PropertyNameString { get; internal set; } 

        public static ProperyNameColumnName Factory(PropertyName propertyName)
        {
            switch (propertyName)
            {
                case PropertyName.Province:
                    return new ProperyNameColumnName("Provinces.provinceName","Province");
                case PropertyName.City:
                    return new ProperyNameColumnName("Cities.cityName","City");
                case PropertyName.District:
                    return new ProperyNameColumnName("Districts.districtName","District");
                case PropertyName.MinPrice:
                    return new ProperyNameColumnName("Price.price","MinPrice");
                case PropertyName.MaxPrice:
                    return new ProperyNameColumnName("Price.price","MaxPrice");
                case PropertyName.UrgentAdvertisementsOnly:
                    return new ProperyNameColumnName("UrgentAdvertisementsOnly", "UrgentAdvertisementsOnly");
                case PropertyName.TransportationBrandId:
                    return new ProperyNameColumnName("Brands.brandId", "TransportationBrandId");
                case PropertyName.TransportationModelId:
                    return new ProperyNameColumnName("CarModel.modelId", "TransportationModelId");
                default:
                    throw new Exception("propertyName is not a valid property");
            }
        }
    }

    public enum PropertyName
    {
        Province,
        City,
        District,

        MaxPrice,
        MinPrice,
        UrgentAdvertisementsOnly,

        TransportationBrandId,
        TransportationModelId
    }
}
