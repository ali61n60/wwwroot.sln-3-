using System.Runtime.Serialization;

namespace Repository.QueryPattern.BaseQuery
{
    [DataContract]
    public abstract class BaseQuery
    {
        public readonly OrderBy _defaultOrderBy = OrderBy.DateAsc;

        [DataMember]
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
                    OredrBy = _defaultOrderBy;
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
