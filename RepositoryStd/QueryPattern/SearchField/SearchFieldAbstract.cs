using System.Data.SqlClient;
using RepositoryStd.QueryPattern;

namespace RepositoryStd.QueryPattern.SearchField
{
    public abstract class SearchFieldAbstract
    {
        public string DatabaseColumnName { get; protected set; }
        public string PropertyName { get; protected set; }
        public CriteriaOperator CriteriaOperatorField { get; protected set; }
        public bool ApplyFieldInCriteria { get; protected set; }

        public void setApplyFieldInCriteria(bool applyField)
        {
            ApplyFieldInCriteria = applyField;
        }

        public virtual string GetWhereClause()
        {
            if (!ApplyFieldInCriteria)
                return "";
            else if (CriteriaOperatorField != CriteriaOperator.In)
            {
                return " AND " + DatabaseColumnName + CriteriaOperatorHelper.GetSqlOperator(CriteriaOperatorField) + " @" +
                PropertyName;
            }
            else if (CriteriaOperatorField == CriteriaOperator.In)
            {
                return " AND " + DatabaseColumnName + CriteriaOperatorHelper.GetSqlOperator(CriteriaOperatorField) +
                       " ( @" + PropertyName+ ")";
            }
            return null;
        }

        public abstract void FillSqlCommandParameter(SqlCommand command);

    }
}
