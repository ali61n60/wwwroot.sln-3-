using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ModelStd.Advertisements;
using ModelStd.Advertisements.CustomExceptions;
using ModelStd.Db.Ad;

using ModelStd.IRepository;
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Helper;
using RepositoryStd.Context.Identity;
using RepositoryStd.Messages;
using RepositoryStd.QueryPattern;

namespace RepositoryStd.Repository
{
    public class AdvertisementCommonRepository : IRepository<AdvertisementCommon>
    {
        private readonly string _conectionString;
        private readonly ICategoryRepository _categoryRepository;
      
        public AdvertisementCommonRepository(string connectionString, ICategoryRepository categoryRepository)
        {
            _conectionString = connectionString;
            _categoryRepository = categoryRepository;
        }

        public IEnumerable<AdvertisementCommon> FindBy(Dictionary<string, string> queryParameters)
        {
            return FindBy(queryParameters, 1, 1000000);//return first 1000000 rows of data in database
        }

        //Called from service layer
        public IEnumerable<AdvertisementCommon> FindBy(Dictionary<string, string> queryParameters, int startIndex, int count)
        {
            List<AdvertisementCommon> _searchResultItems = new List<AdvertisementCommon>(count);
            ////TODO research for singleton dbContext
            AdDbContext adDbContext = new AdDbContext();

            IQueryable<Advertisements> list = GetQueryableList(queryParameters, adDbContext);


            //TODO include ad owner information into each ad (UserId,Email And PhoneNumber)
            AppIdentityDbContext appIdentityDbContext=new AppIdentityDbContext();
            
            //uegentOnly
            
            list = (IOrderedQueryable<Advertisements>)list.Skip(startIndex - 1).Take(count);

            foreach (Advertisements advertisement in list)
            {
                _searchResultItems.Add(GetAdvertisementCommonFromDatabaseResult(advertisement,appIdentityDbContext));
            }
            return _searchResultItems;
        }

        public IQueryable<Advertisements> GetQueryableList(Dictionary<string, string> queryParameters, AdDbContext adDbContext)
        {
            IQueryable<Advertisements> list = adDbContext.Advertisements
                .Include(advertisement => advertisement.Category)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivilege)
                .Include(advertisement => advertisement.AdStatus)
                .Include(advertisement => advertisement.Price)
                .Where(advertisement => advertisement.AdStatusId == 3); //only accepted ads

            list = orderByClause(list, queryParameters); //OrderBy
            list = wherClauseCategoryId(list, queryParameters); //Category
            list = WhereClausePrice(list, queryParameters); //MinPrice and MAxPrice
            list = whereClauseDistrictId(list, queryParameters); //DistrictId
            return list;
        }


        private IQueryable<Advertisements> orderByClause(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            //TODO act based on user input
            OrderBy orderByUserInput = ParameterExtractor.ExtractOrderBy(queryParameters);
            switch (orderByUserInput)
            {
                    case OrderBy.PriceAsc:
                        return list.OrderBy(advertisement => advertisement.Price.price);
                    case OrderBy.PriceDesc:
                        return list.OrderByDescending(advertisements => advertisements.Price.price);
                    case OrderBy.DateAsc:
                        return list.OrderBy(advertisements => advertisements.AdInsertDateTime);
                    case OrderBy.DateDesc:
                        return list.OrderByDescending(advertisements => advertisements.AdInsertDateTime);
                default:
                    return list;
            }
        }
        private IQueryable<Advertisements> wherClauseCategoryId(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            int firstLevelCategoryId = ParameterExtractor.ExtractCatgoryId(queryParameters);
            if (firstLevelCategoryId == 0)//root is selected so do not include anything in where clause
            {
                return list;
            }
            List<int> fullCategoryIdList = new List<int> { firstLevelCategoryId };
            IList<Category> secondLevelCategories= _categoryRepository.GetAllChildernCategories(firstLevelCategoryId);
            List<Category> thirdLevelCategories=new List<Category>();
            foreach (Category secondLevelCategory in secondLevelCategories)
            {
                fullCategoryIdList.Add(secondLevelCategory.CategoryId);
                thirdLevelCategories.AddRange(_categoryRepository.GetAllChildernCategories(secondLevelCategory.CategoryId));
            }
            
            foreach (Category thirdLevelCategory in thirdLevelCategories)
            {
                fullCategoryIdList.Add(thirdLevelCategory.CategoryId);
            }
            
            list = list.Where(advertisement => fullCategoryIdList.Contains(advertisement.CategoryId) );
            return list;
        }
        private IQueryable<Advertisements> WhereClausePrice(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            decimal minPrice = ParameterExtractor.ExtractMinPrice(queryParameters);
            decimal maxPrice = ParameterExtractor.ExtractMaxPrice(queryParameters);
            PriceType priceType = ParameterExtractor.ExtractPriceType(queryParameters);
            if (minPrice != ParameterExtractor.MinPriceDefault)
                list = list.Where(advertisement => advertisement.Price.price > minPrice);
            if (maxPrice != ParameterExtractor.MaxPriceDefault)
                list = list.Where(advertisement => advertisement.Price.price < maxPrice);
            if (priceType != ParameterExtractor.PriceTypeDefault)
                list = list.Where(advertisement => advertisement.Price.priceType == Price.ConverPriceTypeToString(priceType));
            return list;
        }
        private IQueryable<Advertisements> whereClauseDistrictId(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            List<int> districtList = ParameterExtractor.ExtractDistrictIds(queryParameters);
            if (districtList.Count > 0)
                list = list.Where(advertisement => districtList.Contains(advertisement.DistrictId));
            return list;
        }

        public AdvertisementCommon GetAdvertisementCommonFromDatabaseResult(Advertisements advertisement, AppIdentityDbContext identityDbContext)
        {
            AdvertisementCommon tempAdvertisementCommon = new AdvertisementCommon()
            {

                AdvertisementId = advertisement.AdId,
                UserId = advertisement.UserId,
                AdvertisementTitle = advertisement.AdTitle,//TODO test for null
                AdvertisementTime = advertisement.AdInsertDateTime,
                AdvertisementStatusId = advertisement.AdStatusId,
                AdvertisementStatus = advertisement.AdStatus.AdStatus1,
                AdvertisementCategory = advertisement.Category.CategoryName,
                AdvertisementCategoryId = advertisement.CategoryId,
                AdvertisementComments = advertisement.AdComments,//TODO test for null
                NumberOfVisit = advertisement.AdNumberOfVisited,//TODO test for null
                Email =identityDbContext.Users.First(user => user.Id== advertisement.UserId).Email,//TODO test for null
                PhoneNumber = identityDbContext.Users.First(user => user.Id == advertisement.UserId).PhoneNumber,//TODO test for null
                DistrictId = advertisement.DistrictId,
                DistrictName = advertisement.District.DistrictName,
                CityName = advertisement.District.City.CityName,
                ProvinceName = advertisement.District.City.Province.ProvinceName,
                AdvertisementPrice = advertisement.Price
            };
            tempAdvertisementCommon.AdvertisementPrice.Ad = null;//prevent self referencing
            return tempAdvertisementCommon;
        }

        public void Add(AdvertisementCommon entity)
        {
            //Cannot Insert a new ad from Common Repository
            throw new NotImplementedException();
        }

        public void Remove(AdvertisementCommon entity)
        {
            //Cannot Remove an ad from Common Repository
            throw new NotImplementedException();
        }

        public void Save(AdvertisementCommon entity)
        {
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_saveAdCommon", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    FillSaveCommandParameters(command, entity); //insert input parameters
                    AddReturnParameterToCommand(command);
                    try
                    {
                        connection.Open();
                        command.ExecuteNonQuery();
                        if (command.Parameters["returnValue"].Value.ToString() == "0")
                        {
                            throw new Exception(" خطا در دیتا بیس");
                        }
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
            }
        }

        public void FillSaveCommandParameters(SqlCommand command, AdvertisementCommon entity)
        {
            command.Parameters.Add("@adStatusId", SqlDbType.Int).Value = entity.AdvertisementStatusId;

            command.Parameters.Add("@adId", SqlDbType.UniqueIdentifier).Value = entity.AdvertisementId;
            command.Parameters.Add("@districtId", SqlDbType.Int).Value = entity.DistrictId;
            command.Parameters.Add("@adInsertDateTime", SqlDbType.SmallDateTime).Value = entity.AdvertisementTime;
            command.Parameters.Add("@adTitle", SqlDbType.NVarChar).Value = entity.AdvertisementTitle;
            command.Parameters.Add("@adComments", SqlDbType.NChar).Value = entity.AdvertisementComments;
            command.Parameters.Add("@adNumberOfVisited", SqlDbType.Int).Value = entity.NumberOfVisit;
            //command.Parameters.Add("@price", SqlDbType.Money).Value = entity.AdvertisementPrice.price1;
            //command.Parameters.Add("@priceType", SqlDbType.NVarChar).Value = entity.AdvertisementPrice.priceType;
            command.Parameters.Add("@privilageId", SqlDbType.Int).Value = entity.AdPrivilegeId;

            //Added from adTransRepo
            command.Parameters.Add("@UserId", SqlDbType.UniqueIdentifier).Value = entity.UserId;
            command.Parameters.Add("@categoryId", SqlDbType.Int).Value = entity.AdvertisementCategoryId;
            command.Parameters.Add("@adLink", SqlDbType.NVarChar).Value = "the link is not in the design yet";
        }

        public void AddReturnParameterToCommand(SqlCommand command)
        {
            SqlParameter returnParameter = new SqlParameter
            {
                ParameterName = "returnValue",
                Direction = ParameterDirection.ReturnValue
            };
            command.Parameters.Add(returnParameter);
        }


        public IEnumerable<AdvertisementCommon> GetUserAdvertisements(string username)
        {
            List<AdvertisementCommon> searchResultItems = new List<AdvertisementCommon>();
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_getUserAdvertisements", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@username", SqlDbType.NVarChar).Value = username;//insert input parameters
                    connection.Open();
                    SqlDataReader sqlDataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    while (sqlDataReader.Read())
                    {
                        var tempAdvertisementCommon = new AdvertisementCommon();
                        fillAdvertisementCommonFromDataReader(tempAdvertisementCommon, sqlDataReader);
                        searchResultItems.Add(tempAdvertisementCommon);
                    }
                }
            }
            return searchResultItems;
        }


        //sp To be removed
        public IEnumerable<AdvertisementCommon> FindAll()
        {
            List<AdvertisementCommon> searchResultItems = new List<AdvertisementCommon>();
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_findAllAdCommon", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();
                    SqlDataReader sqlDataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    while (sqlDataReader.Read())
                    {
                        AdvertisementCommon tempAdvertisementCommon = new AdvertisementCommon();
                        RepositoryResponse repositoryResponse = fillAdvertisementCommonFromDataReader(tempAdvertisementCommon, sqlDataReader);
                        if (!repositoryResponse.Success)
                        {
                            throw new Exception(repositoryResponse.Message);
                        }
                        searchResultItems.Add(tempAdvertisementCommon);
                    }
                }
            }
            return searchResultItems;
        }

        //TODO use EF
        public AdvertisementCommon FindBy(Guid Id)
        {
            string commandText = "";//BaseSelectCommandText() + " WHERE adId=@adId ";
            AdvertisementCommon tempAdvertisementCommon;
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.Add("@adId", SqlDbType.UniqueIdentifier).Value = Id;
                    connection.Open();
                    SqlDataReader sqlDataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    if (sqlDataReader.Read())
                    {
                        tempAdvertisementCommon = new AdvertisementCommon();
                        RepositoryResponse responseBase = fillAdvertisementCommonFromDataReader(tempAdvertisementCommon, sqlDataReader);
                        if (!responseBase.Success)
                        {
                            throw new Exception(responseBase.Message);
                        }
                    }
                    else
                    {
                        throw new AdvertisementNotFoundException();
                    }
                }
            }
            return tempAdvertisementCommon;
        }

        public void IncrementNumberOfVisit(Guid adGuid)
        {
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_increment_number_of_visit", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@adGuid", SqlDbType.UniqueIdentifier).Value = adGuid;
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }


        //helper method
        public static RepositoryResponse fillAdvertisementCommonFromDataReader
          (AdvertisementCommon advertisementCommon, SqlDataReader dataReader)
        {
            RepositoryResponse responseBase = new RepositoryResponse();
            try
            {
                advertisementCommon.AdvertisementId = (Guid)dataReader["adId"];
                advertisementCommon.UserId = (string)dataReader["UserId"];
                advertisementCommon.AdvertisementCategoryId = (int)dataReader["categoryId"];
                advertisementCommon.DistrictId = (int)dataReader["districtId"];
                advertisementCommon.AdvertisementTime = (DateTime)dataReader["adInsertDateTime"];
                advertisementCommon.AdvertisementStatusId = (int)dataReader["adStatusId"];
                if (!(dataReader["adTitle"] is DBNull))
                {
                    advertisementCommon.AdvertisementTitle = (string)dataReader["adTitle"];
                }
                if (!(dataReader["adComments"] is DBNull))
                {
                    advertisementCommon.AdvertisementComments = (string)dataReader["adComments"];

                }
                if (!(dataReader["adNumberOfVisited"] is DBNull))
                {
                    advertisementCommon.NumberOfVisit = (int)dataReader["adNumberOfVisited"];
                }

                if (!(dataReader["emailAddress"] is DBNull))
                {
                    advertisementCommon.Email = (string)dataReader["emailAddress"];
                }
                if (!(dataReader["phoneNumber"] is DBNull))
                {
                    advertisementCommon.PhoneNumber = (string)dataReader["phoneNumber"];
                }
                advertisementCommon.CityName = (string)dataReader["cityName"];
                advertisementCommon.AdvertisementCategory = (string)dataReader["categoryName"];
                advertisementCommon.DistrictName = (string)dataReader["districtName"];
                advertisementCommon.ProvinceName = (string)dataReader["provinceName"];
                advertisementCommon.AdvertisementStatus = (string)dataReader["adStatus"];
                if (!(dataReader["price"] is DBNull))
                {
                    //advertisementCommon.AdvertisementPrice.price1 = (decimal)dataReader["price"];
                }
                if (!(dataReader["priceType"] is DBNull))
                {
                    // advertisementCommon.AdvertisementPrice.priceType = (string)dataReader["priceType"];

                }
                responseBase.Success = true;
                responseBase.Message = "OK";
            }
            catch (Exception ex)
            {
                responseBase.Success = false;
                responseBase.Message = ex.Message;
            }
            return responseBase;
        }
    }
}
