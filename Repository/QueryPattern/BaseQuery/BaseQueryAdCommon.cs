using System.Runtime.Serialization;
using Model.IRepository;
using System.Collections.Generic;
using System.Data.SqlClient;
using Repository.QueryPattern.SearchField;

namespace Repository.QueryPattern.BaseQuery
{
    [DataContract]
    public class BaseQueryAdCommon : BaseQuery, IQuery
    {
        private List<SearchFieldAbstract> _searchFieldList = new List<SearchFieldAbstract>();

        public SearchFieldDecimal MinimumPrice { get; private set; }
        public SearchFieldDecimal MaximumPrice { get; private set; }
        public SearchFieldBool OnlyWithPictures { get; private set; }
        public SearchFieldInteger AdPrivilage { get; private set; }
        public SearchFieldIntegerArray DistrictId { get; private set; }
        public SearchFieldIntegerArray CategoryId { get; private set; }

        public BaseQueryAdCommon(Dictionary<string, string> userInput)
        {
            
            MinimumPrice = new SearchFieldDecimal
                ("MinimumPrice", "Price.price", CriteriaOperator.GreaterThanOrEqual, 0, decimal.MaxValue, 0, userInput);
            _searchFieldList.Add(MinimumPrice);

            MaximumPrice = new SearchFieldDecimal
                ("MaximumPrice", "Price.price", CriteriaOperator.LessThanOrEqual, 0, decimal.MaxValue, decimal.MaxValue, userInput);
            _searchFieldList.Add(MaximumPrice);

            DistrictId = new SearchFieldIntegerArray("DistrictId", "Advertisements.districtId",CriteriaOperator.In, 0,1000,0, userInput);
            _searchFieldList.Add(DistrictId);

            CategoryId = new SearchFieldIntegerArray("CategoryId", "Advertisements.categoryId", CriteriaOperator.In, 0,
                223, 0, userInput);
            _searchFieldList.Add(CategoryId);

            AdPrivilage = new SearchFieldInteger("UrgentAdsOnly", "AdPrivilege.privilageId",CriteriaOperator.Equal, 1,4,1,userInput);
            _searchFieldList.Add(AdPrivilage);

            OnlyWithPictures = new SearchFieldBool("OnlyWithPictures", "NotApplicableYet", false, userInput);//to be added

            setOrderBy(userInput);
        }
        private void setOrderBy(Dictionary<string, string> userInputDictionary)
        {
            SetOrderByFromString(userInputDictionary.ContainsKey("OrderBy")
                ? userInputDictionary["OrderBy"]
                : "giveMeDefaultOrderBy");
        }
        
        public string GetWhereClause()
        {
            string whereClause = "";

            foreach (SearchFieldAbstract searchField in _searchFieldList)
            {
                whereClause += searchField.GetWhereClause();
            }

            return whereClause;
        }

        public void FillCommandParameters(SqlCommand command) 
        {
            foreach (SearchFieldAbstract searchField in _searchFieldList)
            {
                searchField.FillSqlCommandParameter(command);
            }
        }
    }
}
