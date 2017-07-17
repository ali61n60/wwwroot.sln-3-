using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Repository.QueryPattern.SearchField
{
    public class SearchFieldString : SearchField<string>
    {
        public SearchFieldString(string propertyName, string databaseColumnName, CriteriaOperator criteriaOperator, string defaultValue, Dictionary<string, string> dictionary)
        {
            PropertyName = propertyName;
            DatabaseColumnName = databaseColumnName;
            CriteriaOperatorField = criteriaOperator;
            DefaultValue = defaultValue;
            setValue(dictionary);
        }
        

        private void setValue(Dictionary<string, string> dictionary)
        {
            if (dictionary.ContainsKey(PropertyName))
            {
                Value = dictionary[PropertyName];
                ApplyFieldInCriteria = true;
            }
            else
            {
                Value = DefaultValue;
                ApplyFieldInCriteria = false;
            }
        }

        public override void FillSqlCommandParameter(SqlCommand command)
        {
            if (ApplyFieldInCriteria)
            {
                command.Parameters.Add("@" + PropertyName, SqlDbType.NVarChar).Value = Value;
            }
        }
    }
}
