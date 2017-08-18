using System;
using System.Collections.Generic;
using System.Text;
using ModelStd.DB;

namespace ModelStd
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

        public static readonly string MinPriceKey = "MinPrice";
        public static readonly decimal MinPriceDefault = -1;

        public static readonly string MaxPriceKey = "MaxPrice";
        public static readonly decimal MaxPriceDefault = 1000000000000;

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
                if (!decimal.TryParse(inputDictionary[MinPriceKey], out tempMaxPrice))
                    tempMaxPrice = MaxPriceDefault;
            }
            if (tempMaxPrice > MaxPriceDefault)
                tempMaxPrice = MaxPriceDefault;

            return tempMaxPrice;
        }



    }
}
