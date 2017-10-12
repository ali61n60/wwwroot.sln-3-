using System.Collections.Generic;
using ModelStd.Db.Ad;
using RepositoryStd.QueryPattern;


namespace RepositoryStd.Context.Helper
{
    public class ParameterExtractor
    {
        public static readonly string CategoryIdKey = "CategoryId";
        public static readonly int CategoryIdDefault = 100;

        public static readonly string StartIndexKey = "StartIndex";
        public static readonly int StartIndexDefault = 1;

        public static readonly string CountKey = "Count";
        public static readonly int CountDefault = 5;
        public static readonly int MinCount = 1;
        public static readonly int MaxCount = 20;

        public static readonly string PriceTypeKey = "PriceType";
        public static readonly PriceType PriceTypeDefault=PriceType.All;

        public static readonly string MinPriceKey = "MinimumPrice";
        public static readonly decimal MinPriceDefault = -1;

        public static readonly string MaxPriceKey = "MaximumPrice";
        public static readonly decimal MaxPriceDefault = 1000000000000;

        public static readonly string DistrictIdKey = "DistrictId";
        public static readonly List<int> DistrctIdDefault=new List<int>();

        public static readonly string OrderByKey = "OrderBy";
        public static readonly OrderBy OrderByDefault=OrderBy.DateAsc;

        public static int ExtractCatgoryId(Dictionary<string, string> inputDictionary)
        {
            int tempCategoryId = CategoryIdDefault;
            if (inputDictionary.ContainsKey(CategoryIdKey))
            {
                if (!int.TryParse(inputDictionary[CategoryIdKey], out tempCategoryId))
                    tempCategoryId = CategoryIdDefault;
            }

            return tempCategoryId;
        }

        public static int ExtractStartIndex(Dictionary<string, string> inputDictionary)
        {
            int tempStartIndex = StartIndexDefault;
            if (inputDictionary.ContainsKey(StartIndexKey))
            {
                if (!int.TryParse(inputDictionary[StartIndexKey], out tempStartIndex))
                    tempStartIndex = StartIndexDefault;
            }
            if (tempStartIndex < 0)
                tempStartIndex = StartIndexDefault;

            return tempStartIndex;
        }

        public static int ExtractCount(Dictionary<string, string> inputDictionary)
        {
            int tempCount = CountDefault;
            if (inputDictionary.ContainsKey(CountKey))
            {
                if (!int.TryParse(inputDictionary[CountKey], out tempCount))
                    tempCount = CountDefault;
            }
            if (tempCount > MaxCount)
                tempCount = MaxCount;
            else if (tempCount < MinCount)
                tempCount = MinCount;

            return tempCount;
        }

        public static PriceType ExtractPriceType(Dictionary<string, string> inputDictionary)
        {
            PriceType temPriceType = PriceTypeDefault;
            if (inputDictionary.ContainsKey(PriceTypeKey))
                temPriceType= Price.ParsePriceType(inputDictionary[PriceTypeKey]);
            
            return temPriceType;
        }

        public static decimal ExtractMinPrice(Dictionary<string, string> inputDictionary)
        {
            decimal tempMinPrice = MinPriceDefault;
            if (inputDictionary.ContainsKey(MinPriceKey))
            {
                if (!decimal.TryParse(inputDictionary[MinPriceKey], out tempMinPrice))
                    tempMinPrice = MinPriceDefault;
            }
            if (tempMinPrice < MinPriceDefault)
                tempMinPrice = MinPriceDefault;

            return tempMinPrice;
        }

        public static decimal ExtractMaxPrice(Dictionary<string, string> inputDictionary)
        {
            decimal tempMaxPrice = MaxPriceDefault;
            if (inputDictionary.ContainsKey(MaxPriceKey))
            {
                if (!decimal.TryParse(inputDictionary[MaxPriceKey], out tempMaxPrice))
                    tempMaxPrice = MaxPriceDefault;
            }
            if (tempMaxPrice > MaxPriceDefault)
                tempMaxPrice = MaxPriceDefault;

            return tempMaxPrice;
        }

        public static List<int> ExtractDistrictIds(Dictionary<string, string> inputDictionary)
        {
            List<int> tempList=new List<int>();
            int tempDistrict;
            if (inputDictionary.ContainsKey(DistrictIdKey))
            {
                string inputDistrictValue = inputDictionary[DistrictIdKey];
                string[] districtArrayString = inputDistrictValue.Split(',');
                foreach (var s in districtArrayString)
                {
                    if(int.TryParse(s,out tempDistrict))
                        tempList.Add(tempDistrict);
                }
                return tempList;
            }

            return DistrctIdDefault;
        }

        public static OrderBy ExtractOrderBy(Dictionary<string, string> inputDictionary)
        {
            OrderBy tempOrderBy = OrderByDefault;
            if (inputDictionary.ContainsKey(OrderByKey))
            {
                string userInputOrderByValue = inputDictionary[OrderByKey];
                tempOrderBy= OrderByHelper.SetOrderByFromString(userInputOrderByValue, OrderByDefault);
            }
            return tempOrderBy;
        }

    }
}
