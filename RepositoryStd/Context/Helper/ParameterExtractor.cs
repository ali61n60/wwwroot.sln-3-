using System;
using System.Collections.Generic;
using ModelStd.Advertisements.Price;


namespace RepositoryStd.Context.Helper
{
    public class ParameterExtractor
    {
        public static PriceType ExtractPriceType(Dictionary<string, string> inputDictionary, string key, PriceType defaultPriceType)
        {
            PriceType temPriceType = defaultPriceType;
            if (inputDictionary.ContainsKey(key))
                temPriceType =(PriceType) Enum.Parse(typeof(PriceType), inputDictionary[key]);

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
        
        public static string ExtractString(Dictionary<string, string> queryParameters, string key, string defaultVlaue)
        {
            return queryParameters.ContainsKey(key) ? queryParameters[key] : defaultVlaue;
        }
    }
}
