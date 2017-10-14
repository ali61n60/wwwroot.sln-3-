namespace RepositoryStd.QueryPattern.BaseQuery
{
    
    public abstract class BaseQuery
    {
        public readonly OrderBy DefaultOrderBy = OrderBy.DateAsc;

       
        public OrderBy OredrBy;

       

        public virtual string GetOrderByClause()
        {
            return "ORDER BY "; //+ GetOrderByString();
        }

    }
}
