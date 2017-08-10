using System.Data.SqlClient;

namespace ModelStd.IRepository
{
    public interface IQuery
    {
        string GetOrderByClause();
        string GetWhereClause();
        void FillCommandParameters(SqlCommand command); 
    }
}
