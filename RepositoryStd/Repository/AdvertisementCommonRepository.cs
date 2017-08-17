using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ModelStd.Advertisements;
using ModelStd.IRepository;
using RepositoryStd.DB;
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

        private readonly string SelectStatement = " SELECT Advertisements.adId, Advertisements.UserId, Advertisements.categoryId, " +
                               " Advertisements.districtId, Advertisements.adInsertDateTime, Advertisements.adStatusId, " +
                               " Advertisements.adTitle, Advertisements.adComments, Advertisements.adNumberOfVisited, " +
                               " Price.price , Price.PriceType,  " +
                               " AdPrivilege.privilageId , AdPrivilege.insertionDate,  " +
                               " aspnet_Users.emailAddress, aspnet_Users.phoneNumber, " +
                               " Cities.cityName, Categories.categoryName, Districts.districtName, Provinces.provinceName, AdStatus.adStatus, ";

        public readonly string FromStatement = " FROM  Advertisements LEFT JOIN " +
              " Price ON  Advertisements.adId=Price.adId  LEFT JOIN " +
              " AdPrivilege ON Advertisements.adId=AdPrivilege.adId INNER JOIN " +
              " aspnet_Users ON Advertisements.UserId = aspnet_Users.UserId INNER JOIN " +
              " Categories ON Advertisements.categoryId = Categories.categoryId INNER JOIN " +
              " Districts ON Advertisements.districtId = Districts.districtId INNER JOIN " +
              " Cities ON Districts.cityId = Cities.cityId INNER JOIN " +
              " Provinces ON Cities.provinceId = Provinces.provinceId INNER JOIN " +
              " AdStatus ON Advertisements.adStatusId = AdStatus.adStatusId ";

        
        public AdvertisementCommonRepository(string connectionString)
        {
            _conectionString = connectionString;
        }

        public IEnumerable<AdvertisementCommon> FindBy(IQuery query)
        {
            return FindBy(query, 1, 1000000);//return first 1000000 rows of data in database
        }

        //Called from service layer
        public IEnumerable<AdvertisementCommon> FindBy(IQuery query, int startIndex, int count)
        {
            _searchResultItems = new List<AdvertisementCommon>();
            DbContextFactory dbContextFactory=new DbContextFactory(_conectionString);
            AdCommonDbContext adCommonDbContext = dbContextFactory.Create<AdCommonDbContext>();
            string result = "";
            


            //var myList = adCommonDbContext.Advertisements.Skip(index).Take(count);
            var list = adCommonDbContext.Advertisements
                .Where(advertisement => advertisement.categoryId == 100 && advertisement.adStatusId==3)//adStatusId=3 (accepted adds only)
                .Include(advertisement => advertisement.Category)
                .Include(advertisement => advertisement.aspnet_Users)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivileges)
                .Include(advertisement => advertisement.AdStatu)
                .Include(advertisement => advertisement.Price)
                .Skip(startIndex-1).Take(count);
                
            foreach (var advertisement in list)
            {
                /*
                 
                 * private string getSelectCommandText(IQuery query)
        {
            return " WITH Results AS ( "
                   + BaseSelectCommandText(query.GetOrderByClause())
                   + " WHERE Advertisements.adStatusId=3 " //approved advertisements
                   + query.GetWhereClause()
                   + " ) SELECT * FROM Results WHERE RowNumber BETWEEN @start AND @end ";
        }
                 * 
                 * 
                  private readonly string SelectStatement = " SELECT Advertisements.adId, Advertisements.UserId, Advertisements.categoryId, " +
                               " Advertisements.districtId, Advertisements.adInsertDateTime, Advertisements.adStatusId, " +
                               " Advertisements.adTitle, Advertisements.adComments, Advertisements.adNumberOfVisited, " +
                               " Price.price , Price.PriceType,  " +
                               " AdPrivilege.privilageId , AdPrivilege.insertionDate,  " +
                               " aspnet_Users.emailAddress, aspnet_Users.phoneNumber, " +
                               " Cities.cityName, Categories.categoryName, Districts.districtName, Provinces.provinceName, AdStatus.adStatus, ";

        public readonly string FromStatement = " FROM  Advertisements LEFT JOIN " +
              " Price ON  Advertisements.adId=Price.adId  LEFT JOIN " +
              " AdPrivilege ON Advertisements.adId=AdPrivilege.adId INNER JOIN " +
              " aspnet_Users ON Advertisements.UserId = aspnet_Users.UserId INNER JOIN " +
              " Categories ON Advertisements.categoryId = Categories.categoryId INNER JOIN " +
              " Districts ON Advertisements.districtId = Districts.districtId INNER JOIN " +
              " Cities ON Districts.cityId = Cities.cityId INNER JOIN " +
              " Provinces ON Cities.provinceId = Provinces.provinceId INNER JOIN " +
              " AdStatus ON Advertisements.adStatusId = AdStatus.adStatusId ";
 
                  
                 
                
                if (!(dataReader["price"] is DBNull))
                {
                    advertisementCommon.AdvertisementPrice.price = (decimal)dataReader["price"];
                }
                if (!(dataReader["priceType"] is DBNull))
                {
                    advertisementCommon.AdvertisementPrice.SetPriceTypeFromString((string)dataReader["priceType"]);
                }
                */
                AdvertisementCommon tempAdvertisementCommon = new AdvertisementCommon()
                {
                    AdvertisementId = advertisement.adId,
                    UserId = advertisement.UserId,
                    AdvertisementTitle = advertisement.adTitle,//TODO test for null
                    AdvertisementTime = advertisement.adInsertDateTime,
                    AdvertisementStatusId = advertisement.adStatusId,
                    AdvertisementStatus = advertisement.AdStatu.adStatus,
                    AdvertisementCategory = advertisement.Category.categoryName,
                    AdvertisementCategoryId = advertisement.categoryId,
                    AdvertisementComments = advertisement.adComments,//TODO test for null
                    NumberOfVisit = advertisement.adNumberOfVisited,//TODO test for null
                    Email = advertisement.aspnet_Users.emailAddress,//TODO test for null
                    PhoneNumber = advertisement.aspnet_Users.phoneNumber,//TODO test for null
                    DistrictId = advertisement.districtId,
                    DistrictName = advertisement.District.districtName,
                    CityName =advertisement.District.City.cityName,
                    ProvinceName = advertisement.District.City.Province.provinceName,
                    AdvertisementPrice = advertisement.Price
                };
                

                _searchResultItems.Add(tempAdvertisementCommon);
            }




            //using (SqlConnection connection = new SqlConnection(_conectionString))
            //{
            //    using (SqlCommand command = new SqlCommand(getSelectCommandText(query), connection))
            //    {
            //        query.FillCommandParameters(command);
            //        command.Parameters.Add("@start", SqlDbType.Int).Value = index;
            //        command.Parameters.Add("@end", SqlDbType.Int).Value = (index + count - 1);

            //        FillSearchResultItemsFromDatabase(connection, command);
            //    }
            //}
            return _searchResultItems;
        }

        private string getSelectCommandText(IQuery query)
        {
            return " WITH Results AS ( "
                   + BaseSelectCommandText(query.GetOrderByClause())
                   + " WHERE Advertisements.adStatusId=3 " //approved advertisements
                   + query.GetWhereClause()
                   + " ) SELECT * FROM Results WHERE RowNumber BETWEEN @start AND @end ";
        }

        private string BaseSelectCommandText(string orderByClause)
        {
            return SelectColumnsNameStatement(orderByClause) + FromStatement;
        }

        public string SelectColumnsNameStatement(string orderByClause)
        {
            return SelectStatement + RowNumberStatement(orderByClause);
        }
        private string RowNumberStatement(String orderByCluase)
        {
            return " ROW_NUMBER() OVER ( " + orderByCluase + "  ) AS RowNumber ";
        }
        public string SelectColumnsNameStatement()
        {
            string statement = SelectStatement + "ORDER BY Advertisements.adInsertDateTime DESC";
            return statement;
        }

        private string BaseSelectCommandText()
        {
            return SelectColumnsNameStatement() + FromStatement;
        }

        private void FillSearchResultItemsFromDatabase(SqlConnection connection, SqlCommand command)
        {
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
            command.Parameters.Add("@price", SqlDbType.Money).Value = entity.AdvertisementPrice.price;
            command.Parameters.Add("@priceType", SqlDbType.NVarChar).Value = entity.AdvertisementPrice.GetStringPriceType();
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
            string commandText = BaseSelectCommandText() + " WHERE adId=@adId ";

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
                    advertisementCommon.AdvertisementPrice.price = (decimal)dataReader["price"];
                }
                if (!(dataReader["priceType"] is DBNull))
                {
                    advertisementCommon.AdvertisementPrice.SetPriceTypeFromString((string)dataReader["priceType"]);
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
