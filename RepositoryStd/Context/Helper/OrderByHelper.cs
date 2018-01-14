namespace RepositoryStd.Context.Helper
{
    public class OrderByHelper
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
    }

   public enum OrderBy  
    {
        DateAsc,
        DateDesc,
        PriceAsc,
        PriceDesc
    }
}
