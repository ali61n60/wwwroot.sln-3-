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

namespace RepositoryStd.Repository
{
    public class AdvertisementTransportationRepository : IRepository<AdvertisementTransportation>
    {
       // private readonly IRepository<AdvertisementCommon> _advertisementCommonRepository;
        private readonly ICommonRepository _commonRepository;

        private readonly string _conectionString;

        
        public AdvertisementTransportationRepository(string connectionString, ICommonRepository commonRepository)
        {
            _conectionString = connectionString;
           _commonRepository=commonRepository;
        }

        public IEnumerable<AdvertisementTransportation> FindBy(Dictionary<string,string> inputDictionary)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<AdvertisementTransportation> FindBy(Dictionary<string, string> inputDictionary,int startIndex, int count)
        {
            throw new NotImplementedException();
        }
       
       

       
        //TODO use EF
        public void Add(AdvertisementTransportation entity)
        {
            AdDbContext adDbContext = new AdDbContext();
            Advertisements ad = _commonRepository.GetAdvertisement(entity.AdvertisementCommon);
            AdAttributeTransportation adAttribute = getAdAtribute(entity); 
            
            adDbContext.Advertisements.Add(ad);
            adDbContext.AdAttributeTransportation.Add(adAttribute);

           
        }

        //TODO the method implementation is not complete
        private AdAttributeTransportation getAdAtribute(AdvertisementTransportation entity)
        {
            AdAttributeTransportation adAttribute =  new AdAttributeTransportation();
            adAttribute.AdId = entity.AdvertisementCommon.AdvertisementId;
            adAttribute.BodyColor = entity.BodyColor;
            adAttribute.BodyStatus = entity.BodyStatus.ToString();

            return adAttribute;
        }

        private void fillAddCommandParameters(SqlCommand command, AdvertisementTransportation entity)
        {
            // _advertisementCommonRepository.FillSaveCommandParameters(command, entity.AdvertisementCommon);
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
           // command.Parameters.Add("@bodyStatus", SqlDbType.NVarChar).Value = entity.BodyStatusName;
        }

        public void Remove(AdvertisementTransportation entity)// entity only has advertisementCommon attributes
        {
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_removeAdTransportation", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@adId", SqlDbType.UniqueIdentifier).Value = entity.AdvertisementCommon.AdvertisementId;
                  //  _advertisementCommonRepository.AddReturnParameterToCommand(command);
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
                    //_advertisementCommonRepository.AddReturnParameterToCommand(command);
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
            List<AdvertisementTransportation>  searchResultItems = new List<AdvertisementTransportation>();

            
            RepositoryResponse responseBase;

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_findAllAdTransport", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    try
                    {
                        connection.Open();
                        SqlDataReader dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                        while (dataReader.Read())
                        {
                            AdvertisementTransportation tempAdvertisementTransportation = new AdvertisementTransportation();
                            responseBase = fillAdvertisementTransportationFromDataReader(tempAdvertisementTransportation, dataReader);
                            if (!responseBase.Success)
                            {
                                throw new Exception(responseBase.Message);
                            }
                            searchResultItems.Add(tempAdvertisementTransportation);
                        }
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                    
                }
            }
            return searchResultItems;
        }

        /// <summary>
        /// Find AdvertisementTransportation from database 
        /// </summary>
        /// <param name="adId">Advertisement key</param>
        /// <returns>if ad is not found returns NULL </returns>
        public AdvertisementTransportation FindBy(Guid adId)
        {
            AdvertisementTransportation advertisementTransportation=new AdvertisementTransportation();
            AdDbContext adDbContext = new AdDbContext();
            AppIdentityDbContext appIdentityDbContext = new AppIdentityDbContext();
            IQueryable<Advertisements> list = adDbContext.Advertisements
                .Include(advertisement => advertisement.Category)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivilege)
                .Include(advertisement => advertisement.AdStatus)
                .Include(advertisement => advertisement.Price)
                .Include(advertisements => advertisements.AdAttributeTransportation)
                .Include(advertisements => advertisements.AdAttributeTransportation.Model)
                .Include(advertisements => advertisements.AdAttributeTransportation.Model.Brand)
                .Where(advertisement => advertisement.AdStatusId == 3 && advertisement.AdId==adId);//only accepted ads

            //TODO verify that good query is generated
            string query = list.ToSql();
            Advertisements item = list.FirstOrDefault();
            fillAdTransportation(advertisementTransportation, item, appIdentityDbContext);
            
            return advertisementTransportation;
        }

        private void fillAdTransportation(AdvertisementTransportation adTrans, Advertisements advertisements, AppIdentityDbContext appIdentityDbContext)
        {
            adTrans.AdvertisementCommon =
                _commonRepository.GetAdvertisementCommonFromDatabaseResult(advertisements, appIdentityDbContext);
            adTrans.BodyColor = advertisements.AdAttributeTransportation.BodyColor;
            adTrans.InternalColor = advertisements.AdAttributeTransportation.InternalColor;
            adTrans.SetBodyStatus(advertisements.AdAttributeTransportation.BodyStatus);
            adTrans.BrandId = advertisements.AdAttributeTransportation.Model.BrandId;
            adTrans.BrandName = advertisements.AdAttributeTransportation.Model.Brand.BrandName;
            adTrans.ModelName = advertisements.AdAttributeTransportation.Model.ModelName;
            adTrans.Gearbox = advertisements.AdAttributeTransportation.Gearbox;

            if (advertisements.AdAttributeTransportation.Mileage != null)
                adTrans.Mileage = advertisements.AdAttributeTransportation.Mileage.Value;
            else
                adTrans.Mileage = -1;

            if (advertisements.AdAttributeTransportation.MakeYear != null)
                adTrans.MakeYear = advertisements.AdAttributeTransportation.MakeYear.Value;
            else
                adTrans.MakeYear = -1;


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
                //advertisementTransportation.BodyStatusName = (string)dataReader["bodyStatus"];
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
