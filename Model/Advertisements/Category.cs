using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Model.Advertisements
{
    [DataContract]
    public  class Category
    {
        [DataMember]
        public int CategoryId{get; internal set; }
        [DataMember]
        public int ParentCategoryId{get; internal set; }
        [DataMember]
        public string CategoryName { get; internal set; }
        [DataMember]
        public string EnglishCategoryName { get; internal set; }

        public Category()
        {
            CategoryId = -1;
            ParentCategoryId = -1;
            CategoryName = "";
            EnglishCategoryName = "";
        }

        public Category(int categoryId, int parentCategoryId, string categoryName, string englishCategoryName)
        {
            CategoryId = categoryId;
            ParentCategoryId = parentCategoryId;
            CategoryName = categoryName;
            EnglishCategoryName = englishCategoryName;
        }
    }
}
