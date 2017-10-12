namespace RepositoryStd.QueryPattern
{
    public class OrderByHelper2
    {
        public static OrderBy SetOrderByFromString(string orderBy,OrderBy orderByDefault)
        {
            switch (orderBy)
            {
                case "DateAsc":
                    return OrderBy.DateAsc;
                case "DateDesc":
                    return OrderBy.DateDesc;
                case "PriceAsc":
                    return OrderBy.PriceAsc;
                case "PriceDesc":
                    return OrderBy.PriceDesc;
                default:
                    return orderByDefault;
            }
        }

        //public static  string GetOrderByString()
        //{
        //    string orderByString;
        //    switch (OredrBy)
        //    {
        //        case OrderBy.DateAsc:
        //            orderByString = "adInsertDateTime ASC";
        //            break;
        //        case OrderBy.DateDesc:
        //            orderByString = "adInsertDateTime DESC";
        //            break;
        //        case OrderBy.PriceAsc:
        //            orderByString = "price ASC";
        //            break;
        //        case OrderBy.PriceDesc:
        //            orderByString = "price DESC";
        //            break;
        //        default:
        //            orderByString = "adInsertDateTime ASC";
        //            break;
        //    }

        //    return orderByString;
        //}
    }

    public enum OrderBy  
    {
        DateAsc,
        DateDesc,
        PriceAsc,
        PriceDesc
    }
}
