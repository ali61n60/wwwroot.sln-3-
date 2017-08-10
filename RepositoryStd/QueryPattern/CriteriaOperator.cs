namespace RepositoryStd.QueryPattern
{
    public enum CriteriaOperator
    {
        Equal,
        NotEqual,
        LessThan,
        LessThanOrEqual,
        GreaterThan,
        GreaterThanOrEqual,
        In,
        NotApplicable
    }

    public static class CriteriaOperatorHelper
    {
        public static string GetSqlOperator(CriteriaOperator criteriaOperator)
        {
            string sqlOperator = "";
            switch (criteriaOperator)
            {
                case CriteriaOperator.Equal:
                    sqlOperator = "=";
                    break;
                case CriteriaOperator.NotEqual:
                    sqlOperator = "!=";
                    break;
                case CriteriaOperator.LessThan:
                    sqlOperator = "<";
                    break;
                case CriteriaOperator.LessThanOrEqual:
                    sqlOperator = "<=";
                    break;
                case CriteriaOperator.GreaterThan:
                    sqlOperator = ">";
                    break;
                case CriteriaOperator.GreaterThanOrEqual:
                    sqlOperator = ">=";
                    break;
                case CriteriaOperator.NotApplicable:
                    sqlOperator = "";
                    break;
                    case CriteriaOperator.In:
                    sqlOperator = " IN ";
                    break;
            }

            return sqlOperator;
        }
    }
    
}
