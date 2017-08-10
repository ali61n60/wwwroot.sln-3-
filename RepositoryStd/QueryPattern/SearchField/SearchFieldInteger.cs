using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using RepositoryStd.QueryPattern;

namespace RepositoryStd.QueryPattern.SearchField
{
    public class SearchFieldInteger : SearchField<int>
    {
        public int MinimumValue { get; protected set; }
        public int MaximumValue { get; protected set; }
        public SearchFieldInteger(string propertyName, string databaseColumnName, CriteriaOperator criteriaOperator, int minimumValue, int maximumValue, int defaultValue, Dictionary<string, string> dictionary)
        {
            PropertyName = propertyName;
            DatabaseColumnName = databaseColumnName;
            CriteriaOperatorField = criteriaOperator;
            MinimumValue = minimumValue;
            MaximumValue = maximumValue;
            DefaultValue = defaultValue;
            setValue(dictionary);
        }

        private void setValue(Dictionary<string, string> dictionary)
        {
            if (dictionary.ContainsKey(PropertyName))
                setValueFromString(dictionary[PropertyName]);
            else
                setDefaultValue();
        }

        private void setValueFromString(string value)
        {
            int tempValue;
            if (int.TryParse(value, out tempValue))
            {
                Value = tempValue;
                ApplyFieldInCriteria = true;
                if (!isMinAndMaxValueConditionsMet())
                {
                    Value = DefaultValue;
                    ApplyFieldInCriteria = false;
                }
            }
            else
            {
                setDefaultValue();
            }
        }

        private void setDefaultValue()
        {
            Value = DefaultValue;
            ApplyFieldInCriteria = false;
        }

        private bool isMinAndMaxValueConditionsMet()
        {
            if (Value > MaximumValue || Value < MinimumValue)
                return false;
            return true;
        }

        public override void FillSqlCommandParameter(SqlCommand command)
        {
            if (ApplyFieldInCriteria)
            {
                command.Parameters.Add("@" + PropertyName, SqlDbType.Int).Value = Value;
            }
        }
    }
}
