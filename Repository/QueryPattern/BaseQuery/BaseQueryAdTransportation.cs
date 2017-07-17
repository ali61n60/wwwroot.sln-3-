using Model.IRepository;
using Repository.QueryPattern.SearchField;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;

namespace Repository.QueryPattern.BaseQuery
{
    [DataContract]
    public class BaseQueryAdTransportation : BaseQuery, IQuery
    {
        private List<SearchFieldAbstract> _searchFieldList = new List<SearchFieldAbstract>();
        [DataMember]
        public BaseQueryAdCommon baseQueryAdCommon;

        public SearchFieldString BrandName { get; private set; }
        public SearchFieldInteger BrandId { get; private set; }

        public SearchFieldString ModelName { get; private set; }
        public SearchFieldInteger ModelId{get; private set; }


        public BaseQueryAdTransportation(Dictionary<string, string> userInput)
        {
            baseQueryAdCommon = new BaseQueryAdCommon(userInput);

            BrandName = new SearchFieldString("BrandName", "Brands.brandName", CriteriaOperator.Equal, "", userInput);
            BrandName.setApplyFieldInCriteria(false);
            _searchFieldList.Add(BrandName);

            BrandId = new SearchFieldInteger("BrandId", "Brands.brandId", CriteriaOperator.Equal, 1, 72, 0, userInput);
            _searchFieldList.Add(BrandId);
            
            ModelName=new SearchFieldString("ModelName","CarModel.modelName",CriteriaOperator.Equal, "",userInput);
            ModelName.setApplyFieldInCriteria(false);
            _searchFieldList.Add(ModelName);

            ModelId = new SearchFieldInteger("ModelId", "CarModel.modelId",CriteriaOperator.Equal,1,597,0,userInput);
            _searchFieldList.Add(ModelId);
        }
        
        public string GetWhereClause()
        {
            string whereClause = baseQueryAdCommon.GetWhereClause();

            foreach (SearchFieldAbstract searchField in _searchFieldList)
            {
                whereClause += searchField.GetWhereClause();
            }

            return whereClause;
        }

        public void FillCommandParameters(SqlCommand command)
        {
            baseQueryAdCommon.FillCommandParameters(command);
            foreach (SearchFieldAbstract searchField in _searchFieldList)
            {
                searchField.FillSqlCommandParameter(command);
            }
        }
    }
}
