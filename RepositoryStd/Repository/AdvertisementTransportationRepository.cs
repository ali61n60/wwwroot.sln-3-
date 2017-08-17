using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using ModelStd.Advertisements;
using ModelStd.IRepository;
using RepositoryStd.Messages;

namespace RepositoryStd.Repository
{
    public class AdvertisementTransportationRepository : IRepository<AdvertisementTransportation>
    {
        private readonly IRepository<AdvertisementCommon> _repositoryAdvertisementCommon;
        private readonly AdvertisementCommonRepository advertisementCommonRepository;
        private readonly string _conectionString;

        List<AdvertisementTransportation> _searchResultItems;
        SqlDataReader _dataReader;
        AdvertisementTransportation _tempAdvertisementTransportation;
        RepositoryResponse _responseBase;

        
        public AdvertisementTransportationRepository(IRepository<AdvertisementCommon> repositoryAdvertisementCommon
                                                     , string connectionString)
        {
            _conectionString = connectionString;
            _repositoryAdvertisementCommon = repositoryAdvertisementCommon;
            advertisementCommonRepository=new AdvertisementCommonRepository(connectionString);
        }

        public IEnumerable<AdvertisementTransportation> FindBy(IQuery query)
        {
            return FindBy(query, 1, 1000000);//get first 1000000 rows from database
        }


        //Called from service layer
        public IEnumerable<AdvertisementTransportation> FindBy(IQuery query, int startIndex, int count)
        {
            _searchResultItems = new List<AdvertisementTransportation>();

            string commandText = getSelectCommandText(query);


            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    query.FillCommandParameters(command);
                    command.Parameters.Add("@start", SqlDbType.Int).Value = startIndex;
                    command.Parameters.Add("@end", SqlDbType.Int).Value = (startIndex + count - 1);
                    FillSearchResultItemsFromDatabase(connection, command);
                }
            }
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
            string customColumnNames = " , AdAttributeTransportation.modelId,Brands.brandName ";

            string customJoins = " INNER JOIN AdAttributeTransportation ON Advertisements.adId=AdAttributeTransportation.adId " +
                                 " INNER JOIN CarModel ON AdAttributeTransportation.modelId=CarModel.modelId " +
                                 " INNER JOIN Brands ON CarModel.brandId=Brands.brandId ";

            string commandText = advertisementCommonRepository.SelectColumnsNameStatement(orderByClause) +
                                 customColumnNames +
                                 advertisementCommonRepository.FromStatement +
                                 customJoins;
            return commandText;
        }

        private void FillSearchResultItemsFromDatabase(SqlConnection connection, SqlCommand command)
        {
            connection.Open();
            _dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);

            while (_dataReader.Read())
            {
                _tempAdvertisementTransportation = new AdvertisementTransportation();
                _responseBase =
                    AdvertisementCommonRepository.fillAdvertisementCommonFromDataReader(
                        _tempAdvertisementTransportation.AdvertisementCommon, _dataReader);
                if (!_responseBase.Success)
                {
                    throw new Exception(_responseBase.Message);
                }
                _searchResultItems.Add(_tempAdvertisementTransportation);
            }
        }

        public void Add(AdvertisementTransportation entity)
        {
            SqlConnection connection = new SqlConnection(_conectionString);
            SqlCommand command = new SqlCommand("sp_insertNewAdTransportation", connection);
            command.CommandType = CommandType.StoredProcedure;
            Guid attributeId = Guid.NewGuid();//create a new attributeId to be used in AdAttributeTransportation
            command.Parameters.Add("@attributeId", SqlDbType.UniqueIdentifier).Value = attributeId;
            fillAddCommandParameters(command, entity);
            advertisementCommonRepository.AddReturnParameterToCommand(command);
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

        private void fillAddCommandParameters(SqlCommand command, AdvertisementTransportation entity)
        {
            advertisementCommonRepository.FillSaveCommandParameters(command, entity.AdvertisementCommon);
            fillCommandByCustomAttribute(command, entity);
        }

        private void fillCommandByCustomAttribute(SqlCommand command, AdvertisementTransportation entity)
        {
            command.Parameters.Add("@modelId", SqlDbType.Int).Value = entity.ModelId;
            command.Parameters.Add("@makeYear", SqlDbType.Int).Value = entity.MakeYear;
            command.Parameters.Add("@fuel", SqlDbType.NVarChar).Value = entity.FuelName;
            command.Parameters.Add("@mileage", SqlDbType.Int).Value = entity.Mileage;
            command.Parameters.Add("@gearbox", SqlDbType.NVarChar).Value = entity.Gearbox;
            command.Parameters.Add("@bodyColor", SqlDbType.NVarChar).Value = entity.BodyColor;
            command.Parameters.Add("@internalColor", SqlDbType.NVarChar).Value = entity.InternalColor;
            command.Parameters.Add("@bodyStatus", SqlDbType.NVarChar).Value = entity.BodyStatusName;
        }

        public void Remove(AdvertisementTransportation entity)// entity only has advertisementCommon attributes
        {
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_removeAdTransportation", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@adId", SqlDbType.UniqueIdentifier).Value = entity.AdvertisementCommon.AdvertisementId;
                    advertisementCommonRepository.AddReturnParameterToCommand(command);
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

        public void Save(AdvertisementTransportation entity)
        {
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_saveAdTransportation", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    fillAddCommandParameters(command, entity);
                    advertisementCommonRepository.AddReturnParameterToCommand(command);
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

        public IEnumerable<AdvertisementTransportation> FindAll()
        {
            _searchResultItems = new List<AdvertisementTransportation>();


            RepositoryResponse responseBase;

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_findAllAdTransport", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    try
                    {
                        connection.Open();
                        _dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                        while (_dataReader.Read())
                        {
                            _tempAdvertisementTransportation = new AdvertisementTransportation();
                            responseBase = fillAdvertisementTransportationFromDataReader(_tempAdvertisementTransportation, _dataReader);
                            if (!responseBase.Success)
                            {
                                throw new Exception(responseBase.Message);
                            }
                            _searchResultItems.Add(_tempAdvertisementTransportation);
                        }
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                    
                }
            }
            return _searchResultItems;
        }


        //sp
        public AdvertisementTransportation FindBy(Guid Id)
        {
            AdvertisementTransportation tempAdvertisementTransportation;
            SqlDataReader dataReader = null;
            RepositoryResponse responseBase;

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_findAdTransport", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@adId", System.Data.SqlDbType.UniqueIdentifier).Value = Id;
                    try
                    {
                        connection.Open();
                        dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                        if (dataReader.Read())
                        {
                            tempAdvertisementTransportation = new AdvertisementTransportation();
                            responseBase = fillAdvertisementTransportationFromDataReader(
                                tempAdvertisementTransportation, dataReader);
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
                    catch (Exception)
                    {
                        throw;
                    }
                    
                }
            }
            return tempAdvertisementTransportation;
        }

        public void IncrementNumberOfVisit(Guid adGuid)
        {
            _repositoryAdvertisementCommon.IncrementNumberOfVisit(adGuid);
        }

        private RepositoryResponse fillAdvertisementTransportationFromDataReader(AdvertisementTransportation advertisementTransportation,
                                                                      SqlDataReader dataReader)
        {
            RepositoryResponse responseBase = new RepositoryResponse();
            try
            {
                responseBase = AdvertisementCommonRepository.fillAdvertisementCommonFromDataReader(
                        advertisementTransportation.AdvertisementCommon, dataReader);//fill common attributes
                if (!responseBase.Success)
                {
                    throw new Exception(responseBase.Message);
                }
                advertisementTransportation.ModelId = (int)dataReader["modelId"];
                advertisementTransportation.MakeYear = (int)dataReader["makeYear"];
                advertisementTransportation.FuelName = (string)dataReader["fuel"];
                advertisementTransportation.Mileage = (int)dataReader["mileage"];
                advertisementTransportation.Gearbox = (string)dataReader["gearbox"];
                advertisementTransportation.BodyColor = (string)dataReader["bodyColor"];
                advertisementTransportation.InternalColor = (string)dataReader["internalColor"];
                advertisementTransportation.BodyStatusName = (string)dataReader["bodyStatus"];
                advertisementTransportation.ModelName = (string)dataReader["modelName"];
                advertisementTransportation.BrandName = (string)dataReader["brandName"];

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

        //ni
        public IEnumerable<AdvertisementTransportation> GetUserAdvertisements(string username)
        {
            throw new NotImplementedException();
        }


    }
}
