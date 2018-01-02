using System.Collections.Generic;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using RepositoryStd.QueryPattern;
using RepositoryStd.Repository.Common;


namespace RepositoryStd.Context.Helper
{
    public class ParameterExtractor
    {
        public static PriceType ExtractPriceType(Dictionary<string, string> inputDictionary, string key, PriceType defaultPriceType)
        {
            PriceType temPriceType = defaultPriceType;
            if (inputDictionary.ContainsKey(key))
                temPriceType = Price.ParsePriceType(inputDictionary[key]);

            return temPriceType;
        }
        public static List<int> ExtractDistrictIds(Dictionary<string, string> inputDictionary,string key, List<int> defaultDistrictId)
        {
            List<int> districtIdList = new List<int>();
            int tempDistrict;
            if (inputDictionary.ContainsKey(key))
            {
                string inputDistrictValue = inputDictionary[key];
                string[] districtArrayString = inputDistrictValue.Split(',');
                foreach (var s in districtArrayString)
                {
                    if (int.TryParse(s, out tempDistrict))
                        districtIdList.Add(tempDistrict);
                }
                return districtIdList;
            }

            return defaultDistrictId;
        }

        public static OrderBy ExtractOrderBy(Dictionary<string, string> inputDictionary, string key, OrderBy defaultOrderBy)
        {
            OrderBy currentOrderBy = defaultOrderBy;
            if (inputDictionary.ContainsKey(key))
            {
                string userInputOrderByValue = inputDictionary[key];
                currentOrderBy = OrderByHelper.SetOrderByFromString(userInputOrderByValue, defaultOrderBy);
            }
            return currentOrderBy;
        }



        public static decimal ExtractDecimal(Dictionary<string, string> queryParameters, string key, decimal defaultValue)
        {
            decimal currentValue = defaultValue;
            if (queryParameters.ContainsKey(key))
            {
                if (!decimal.TryParse(queryParameters[key], out currentValue))
                    currentValue = defaultValue;
            }
            return currentValue;
        }


        public static int ExtractInt(Dictionary<string, string> queryParameters, string key, int defaultValue)
        {
            int currentValue = defaultValue;
            if (queryParameters.ContainsKey(key))
            {
                if (!int.TryParse(queryParameters[key], out currentValue))
                    currentValue = defaultValue;
            }
            return currentValue;
        }


        public static FuelType ExtractFuelType(Dictionary<string, string> queryParameters, string fuelTypeKey, FuelType fuelTypeDefault)
        {
            FuelType currentValue = fuelTypeDefault;
            if (queryParameters.ContainsKey(fuelTypeKey))
            {
                string fuelTypeString = queryParameters[fuelTypeKey];
                currentValue = AdvertisementTransportation.GetFuelType(fuelTypeString);
                if (currentValue == FuelType.UnSpecified)//GetFuelType method returns FuelType.UnSpecified in case of no matching string input 
                    currentValue = fuelTypeDefault;
            }

            return currentValue;
        }
    }
}
