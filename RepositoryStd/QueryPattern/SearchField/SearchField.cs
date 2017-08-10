using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RepositoryStd.QueryPattern.SearchField
{
    public abstract class SearchField<T>:SearchFieldAbstract
    {
        public T DefaultValue { get; protected set; }
        public T Value { get; protected set; }
    }
}
