using System.Collections.Generic;
using System.Data.SqlClient;
using ModelStd.IRepository;
using RepositoryStd.QueryPattern.SearchField;


namespace RepositoryStd.QueryPattern.BaseQuery
{
    
    public class BaseQueryAdTransportation : BaseQuery, IQuery
    {
        private readonly List<SearchFieldAbstract> _searchFieldList = new List<SearchFieldAbstract>();
        
        public BaseQueryAdCommon baseQueryAdCommon;

        public SearchFieldString BrandName { get; }
        public SearchFieldInteger BrandId { get; }

        public SearchFieldString ModelName { get; }
        public SearchFieldInteger ModelId{get; }


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
