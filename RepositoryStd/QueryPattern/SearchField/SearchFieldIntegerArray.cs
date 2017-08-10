using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using RepositoryStd.QueryPattern;

namespace RepositoryStd.QueryPattern.SearchField
{
    public class SearchFieldIntegerArray : SearchField<Int32[]>
    {
        public int MinimumValue { get; protected set; }
        public int MaximumValue { get; protected set; }

        private new int  DefaultValue;
        public SearchFieldIntegerArray(string propertyName, string databaseColumnName, CriteriaOperator criteriaOperator, int minimumValue, int maximumValue, int defaultValue, Dictionary<string, string> dictionary)
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
            List<int> tempList=new List<int>();
            int tempValue;

            string[] stringAllValues= value.Split(',');
            
            for (int i=0;i<stringAllValues.Length;i++)
            {
                if (int.TryParse(stringAllValues[i], out tempValue))
                {
                    if (isMinAndMaxValueConditionsMet(tempValue))
                    {
                        tempList.Add(tempValue);
                    }
                }
            }
            if (tempList.Count > 0)
            {
                Value = tempList.ToArray();
                ApplyFieldInCriteria = true;
            }
            else
            {
                ApplyFieldInCriteria = false;
            }
        }
        private void setDefaultValue()
        {
            Value = new[] {DefaultValue};
            ApplyFieldInCriteria = false;
        }

        private bool isMinAndMaxValueConditionsMet(int value)
        {
            if (value > MaximumValue || value < MinimumValue)
                return false;
            return true;
        }


        public override void FillSqlCommandParameter(SqlCommand command)
        {
            if (ApplyFieldInCriteria)
            {
                for (int i = 0; i < Value.Length; i++)
                {
                    command.Parameters.Add("@" + PropertyName + i, SqlDbType.Int).Value = Value[i];
                }
            }
        }

        public override string GetWhereClause()
        {
            if (!ApplyFieldInCriteria)
                return "";
            if (CriteriaOperatorField != CriteriaOperator.In)
            {
                return " AND " + DatabaseColumnName + CriteriaOperatorHelper.GetSqlOperator(CriteriaOperatorField) + " @" +
                PropertyName;
            }
            if (CriteriaOperatorField == CriteriaOperator.In)
            {
                string tempWhereClause = " AND " + DatabaseColumnName +
                                         CriteriaOperatorHelper.GetSqlOperator(CriteriaOperatorField) + " (";
                for (int i = 0; i < Value.Length; i++)
                {
                    tempWhereClause += " @" + PropertyName + i + " ,";
                }
                if (Value.Length > 0)
                {
                    tempWhereClause = tempWhereClause.Substring(0, tempWhereClause.Length - 1);//removelast "," char
                }
                tempWhereClause += ")";
                return tempWhereClause;
            }
            return null;
        }
    }
}
