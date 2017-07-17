using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Repository.QueryPattern.SearchField
{
    public class SearchFieldBool : SearchField<bool>
    {
        public SearchFieldBool(string propertyName, string databaseColumnName, bool defaultValue, Dictionary<string, string> dictionary)
        {
            PropertyName = propertyName;
            DatabaseColumnName = databaseColumnName;
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
            if (value == "True")
            {
                Value = true;
                ApplyFieldInCriteria = true;
            }
            else if (value == "False")
            {
                Value = false;
                ApplyFieldInCriteria = true;
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

        public override void FillSqlCommandParameter(SqlCommand command)
        {
            if (ApplyFieldInCriteria)
            {
                command.Parameters.Add("@" + PropertyName, SqlDbType.Bit).Value = Value;
            }
        }
    }
}
