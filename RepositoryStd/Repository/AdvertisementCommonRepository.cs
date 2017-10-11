using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ModelStd;
using ModelStd.Advertisements;
using ModelStd.Advertisements.CustomExceptions;
using ModelStd.Db.Ad;

using ModelStd.IRepository;
using RepositoryStd.Context.AD;
using RepositoryStd.Messages;

namespace RepositoryStd.Repository
{
    public class AdvertisementCommonRepository : IRepository<AdvertisementCommon>
    {
        private readonly string _conectionString;
        List<AdvertisementCommon> _searchResultItems;
        AdvertisementCommon _tempAdvertisementCommon;
        SqlDataReader _dataReader;
        RepositoryResponse _responseBase;
        
        public AdvertisementCommonRepository(string connectionString)
        {
            _conectionString = connectionString;
        }

        public IEnumerable<AdvertisementCommon> FindBy(Dictionary<string, string> queryParameters)
        {
            return FindBy(queryParameters, 1, 1000000);//return first 1000000 rows of data in database
        }

        //Called from service layer
        public IEnumerable<AdvertisementCommon> FindBy(Dictionary<string, string> queryParameters, int startIndex, int count)
        {
            _searchResultItems = new List<AdvertisementCommon>(count);
            ////TODO research for singleton dbContext
            AdDbContext adDbContext =new AdDbContext();
           
            var list = adDbContext.Advertisements
                .Include(advertisement => advertisement.Category)
                //.Include(advertisement => advertisement.aspnet_Users)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivilege)
                .Include(advertisement => advertisement.AdStatus)
                .Include(advertisement => advertisement.Price)
                .Where(advertisement => advertisement.AdStatusId == 3); //only accepted ads
               // .OrderBy(advertisement => advertisement.Price.price);
            //SetOrderByClause(list, queryParameters);
            wherClauseCategoryId(list, queryParameters);
            WhereClausePrice(list, queryParameters);
            WhereClauseDistrictId(list, queryParameters);

            //uegentOnly


            list = (IOrderedQueryable<Advertisements>) list.Skip(startIndex - 1).Take(count);
            
            foreach (Advertisements advertisement in list)
            {
                _searchResultItems.Add(getAdvertisementCommonFromDatabaseResult(advertisement));
            }
            return _searchResultItems;
        }

        private void SetOrderByClause(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
         //   list=list.OrderBy(advertisement => advertisement.Price.price);
        }


        //TODO change where clause to get an array of categories
        private void wherClauseCategoryId(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            int categoryId = ParameterExtractor.ExtractCatgoryId(queryParameters);
            list=list.Where(advertisement => advertisement.CategoryId == categoryId);
        }
        private void WhereClausePrice(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            decimal minPrice = ParameterExtractor.ExtractMinPrice(queryParameters);
            decimal maxPrice = ParameterExtractor.ExtractMaxPrice(queryParameters);
           // PriceType priceType = ParameterExtractor.ExtractPriceType(queryParameters);
           // if (minPrice != ParameterExtractor.MinPriceDefault)
             //   list = list.Where(advertisement => advertisement.Price.price > minPrice);
           // if (maxPrice != ParameterExtractor.MaxPriceDefault)
             //   list = list.Where(advertisement => advertisement.Price.price < maxPrice);
          //  if (priceType != ParameterExtractor.PriceTypeDefault)
               // list = list.Where(advertisement => advertisement.Price.priceType == Price.ConverPriceTypeToString(priceType));
        }
        private void WhereClauseDistrictId(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            List<int> districtList = ParameterExtractor.ExtractDistrictIds(queryParameters);
            if (districtList.Count > 0)
                list = list.Where(advertisement => districtList.Contains(advertisement.DistrictId));
        }

        private AdvertisementCommon getAdvertisementCommonFromDatabaseResult(Advertisements advertisement)
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
                //Email = advertisement.aspnet_Users.emailAddress,//TODO test for null
                //PhoneNumber = advertisement.aspnet_Users.phoneNumber,//TODO test for null
                DistrictId = advertisement.DistrictId,
                DistrictName = advertisement.District.DistrictName,
                CityName = advertisement.District.City.CityName,
                ProvinceName = advertisement.District.City.Province.ProvinceName,
                AdvertisementPrice = advertisement.Price
            };
            tempAdvertisementCommon.AdvertisementPrice.Ad= null;//prevent self referencing
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
            _searchResultItems = new List<AdvertisementCommon>();

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_getUserAdvertisements", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@username", SqlDbType.NVarChar).Value = username;//insert input parameters
                    connection.Open();
                    _dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    while (_dataReader.Read())
                    {
                        _tempAdvertisementCommon = new AdvertisementCommon();
                        fillAdvertisementCommonFromDataReader(_tempAdvertisementCommon, _dataReader);
                        _searchResultItems.Add(_tempAdvertisementCommon);
                    }
                }
            }
            return _searchResultItems;
        }


        //sp To be removed
        public IEnumerable<AdvertisementCommon> FindAll()
        {
            _searchResultItems = new List<AdvertisementCommon>();

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_findAllAdCommon", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();
                    _dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    while (_dataReader.Read())
                    {
                        _tempAdvertisementCommon = new AdvertisementCommon();
                        _responseBase = fillAdvertisementCommonFromDataReader(_tempAdvertisementCommon, _dataReader);
                        if (!_responseBase.Success)
                        {
                            throw new Exception(_responseBase.Message);
                        }
                        _searchResultItems.Add(_tempAdvertisementCommon);
                    }
                }
            }
            return _searchResultItems;
        }

        public AdvertisementCommon FindBy(Guid Id)
        {
            string commandText = "";//BaseSelectCommandText() + " WHERE adId=@adId ";

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.Add("@adId", SqlDbType.UniqueIdentifier).Value = Id;
                    connection.Open();
                    _dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    if (_dataReader.Read())
                    {
                        _tempAdvertisementCommon = new AdvertisementCommon();
                        _responseBase = fillAdvertisementCommonFromDataReader(_tempAdvertisementCommon, _dataReader);
                        if (!_responseBase.Success)
                        {
                            throw new Exception(_responseBase.Message);
                        }
                    }
                    else
                    {
                        throw new AdvertisementNotFoundException();
                    }
                }
            }
            return _tempAdvertisementCommon;
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
                advertisementCommon.UserId = (Guid)dataReader["UserId"];
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
