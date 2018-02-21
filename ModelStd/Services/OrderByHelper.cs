namespace ModelStd.Services
{
    public class OrderByHelper
    {
        public static readonly string OrderByKey = "OrderBy";
        public static readonly OrderBy OrderByDefault = OrderBy.DateAsc;

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
    }

   public enum OrderBy  
    {
        DateAsc=1,
        DateDesc=2,
        PriceAsc=3,
        PriceDesc=4,
        UnSpecified=5
    }
}
