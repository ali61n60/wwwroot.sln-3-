using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Repository.QueryPattern.SearchField
{
    public class SearchFieldDecimal : SearchField<decimal>
    {
        public decimal MinimumValue { get; protected set; }
        public decimal MaximumValue { get; protected set; }
        public SearchFieldDecimal(string propertyName, string databaseColumnName,CriteriaOperator criteriaOperator, decimal minimumValue, decimal maximumValue, decimal defaultValue, Dictionary<string, string> dictionary)
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
            decimal tempValue;
            if (decimal.TryParse(value, out tempValue))
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
                command.Parameters.Add("@"+PropertyName, SqlDbType.Decimal).Value = Value;
            }
        }
    }
}
