﻿namespace RepositoryStd.QueryPattern.BaseQuery
{
    
    public abstract class BaseQuery
    {
        public readonly OrderBy DefaultOrderBy = OrderBy.DateAsc;

       
        public OrderBy OredrBy;

        protected virtual void SetOrderByFromString(string orderBy)
        {
            switch (orderBy)
            {
                case "DateAsc":
                    OredrBy = OrderBy.DateAsc;
                    break;
                case "DateDesc":
                    OredrBy = OrderBy.DateDesc;
                    break;
                case "PriceAsc":
                    OredrBy = OrderBy.PriceAsc;
                    break;
                case "PriceDesc":
                    OredrBy = OrderBy.PriceDesc;
                    break;
                default:
                    OredrBy = DefaultOrderBy;
                    break;
            }
        }
        protected virtual string GetOrderByString()
        {
            string orderByString;
            switch (OredrBy)
            {
                case OrderBy.DateAsc:
                    orderByString = "adInsertDateTime ASC";
                    break;
                case OrderBy.DateDesc:
                    orderByString = "adInsertDateTime DESC";
                    break;
                case OrderBy.PriceAsc:
                    orderByString = "price ASC";
                    break;
                case OrderBy.PriceDesc:
                    orderByString = "price DESC";
                    break;
                default:
                    orderByString = "adInsertDateTime ASC";
                    break;
            }

            return orderByString;
        }

        public virtual string GetOrderByClause()
        {
            return "ORDER BY " + GetOrderByString();
        }

    }
}
