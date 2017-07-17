using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Repository.QueryPattern.BaseQuery;
using System.Data.SqlClient;

namespace Repository.QueryPattern.SearchField
{
    public abstract class SearchField<T>:SearchFieldAbstract
    {
        public T DefaultValue { get; protected set; }
        public T Value { get; protected set; }
    }
}
