using System.Data.SqlClient;

namespace Model.IRepository
{
    public interface IQuery
    {
        string GetOrderByClause();
        string GetWhereClause();
        void FillCommandParameters(SqlCommand command); 
    }
}
