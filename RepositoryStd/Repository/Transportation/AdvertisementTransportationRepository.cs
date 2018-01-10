using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using ModelStd.Services;
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Helper;
using RepositoryStd.Context.Identity;
using RepositoryStd.Messages;
using RepositoryStd.Repository.Common;

namespace RepositoryStd.Repository.Transportation
{
    //TODO add CarStatus and PlateType to database table
    public class AdvertisementTransportationRepository : IRepository<AdvertisementTransportation>, IAdRepository
    {
        //AdTransportation Properties

        public static readonly string CarModelIdKey = "CarModelId";
        public static readonly int CarModelIdDefault = 0;

        public static readonly string CarBrandIdKey = "BrandId";
        public static readonly int CarBrandIdDefault = 0;

        public static readonly string MakeYearFromKey = "MakeYearFrom";
        public static readonly int MakeYearFromDefault = 0;

        public static readonly string MakeYearToKey = "MakeYearTo";
        public static readonly int MakeYearToDefault = 1400;

        public static readonly string MakeYearKey = "MakeYear";
        public static readonly int MakeYearDefault = 0;

        public static readonly string FuelTypeKey = "Fuel";
        public static readonly FuelType FuelTypeDefault = FuelType.UnSpecified;

        public static readonly string MileageFromKey = "MileageFrom";
        public static readonly int MileageFromDefault = 0;

        public static readonly string MileageToKey = "MileageTo";
        public static readonly int MileageToDefault = 100000000;

        public static readonly string MileageKey = "Mileage";
        public static readonly int MileageDefault = 0;

        public static readonly string GearboxKey = "Gearbox";
        public static readonly GearboxType GearboxDefault = GearboxType.UnSpecified;

        public static readonly string BodyColorKey = "BodyColor";
        public static readonly string BodyColorDefault = "UnSpecified";

        public static readonly string InternalColorKey = "InternalColor";
        public static readonly string InternalColorDefault = "UnSpecified";

        public static readonly string BodyStatusKey = "BodyStatus";
        public static readonly BodyStatus BodyStatusDefault = BodyStatus.UnSpecified;

        public static readonly string CarStatusKey = "CarStatus";
        public static readonly CarStatus CarStatusDefault = CarStatus.UnSpecified;

        public static readonly string PlateTypeKey = "PlateType";
        public static readonly PlateType PlateTypeDefault = PlateType.UnSpecified;

        private readonly ICommonRepository _commonRepository;
        private readonly AdDbContext _adDbContext;
        private readonly AppIdentityDbContext _appIdentityDbContext;



        public AdvertisementTransportationRepository(AdDbContext adDbContext, AppIdentityDbContext appIdentityDbContext, ICommonRepository commonRepository)
        {
            _adDbContext = adDbContext;
            _appIdentityDbContext = appIdentityDbContext;
            _commonRepository = commonRepository;
        }

        public IEnumerable<AdvertisementCommon> FindAdvertisementCommons(Dictionary<string, string> queryParameters)
        {
            List<AdvertisementCommon> searchResultItems = new List<AdvertisementCommon>();
            IQueryable<Advertisements> list = _commonRepository.GetCommonQueryableList(queryParameters);
            //TODO add category specific query to the list
            list = whereClauseCarModelAndBrand(queryParameters, list);
            list = whereClauseMakeYear(queryParameters, list);
            list = whereClauseFuel(queryParameters, list);
            list = whereMileage(queryParameters, list);
            list = whereGearbox(queryParameters, list);
            list = whereBodyColor(queryParameters, list);
            list = whereInternalColor(queryParameters, list);
            list = whereBodyStatus(queryParameters, list);
            list = whereCarStatus(queryParameters, list);
            list = wherePlateType(queryParameters, list);


            list = _commonRepository.EnforceStartIndexAndCount(queryParameters, list);
            foreach (Advertisements advertisement in list)
            {
                searchResultItems.Add(_commonRepository.GetAdvertisementCommonFromDatabaseResult(advertisement));
            }

            return searchResultItems;
        }

        private IQueryable<Advertisements> wherePlateType(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            PlateType plateType = AdvertisementTransportation.GetPlateType(
                ParameterExtractor.ExtractString(queryParameters, PlateTypeKey,
                    AdvertisementTransportation.GetPlateTypeString(PlateTypeDefault)),
                PlateTypeDefault);
            if (plateType != PlateTypeDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.PlateType ==
                    AdvertisementTransportation.GetPlateTypeString(plateType));
            }
            return list;
        }

        private IQueryable<Advertisements> whereCarStatus(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            CarStatus carStatus = AdvertisementTransportation.GetCarStatus(
                ParameterExtractor.ExtractString(queryParameters, CarStatusKey,
                    AdvertisementTransportation.GetCarStatusString(CarStatusDefault)),
                CarStatusDefault);
            if (carStatus != CarStatusDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.CarStatus ==
                    AdvertisementTransportation.GetCarStatusString(carStatus));
            }

            return list;
        }

        private IQueryable<Advertisements> whereBodyStatus(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            BodyStatus bodyStatus = AdvertisementTransportation.GetBodyStatus(
                ParameterExtractor.ExtractString(queryParameters, BodyStatusKey,
                    AdvertisementTransportation.GetBodyStatusString(BodyStatusDefault)),
                BodyStatusDefault);
            if (bodyStatus != BodyStatusDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.BodyStatus ==
                    AdvertisementTransportation.GetBodyStatusString(bodyStatus));
            }
            return list;
        }

        private IQueryable<Advertisements> whereInternalColor(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            string internalColor = ParameterExtractor.ExtractString(queryParameters, InternalColorKey, InternalColorDefault);
            if (internalColor != InternalColorDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.InternalColor == internalColor);
            }

            return list;
        }

        private IQueryable<Advertisements> whereBodyColor(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            string bodyColor = ParameterExtractor.ExtractString(queryParameters, BodyColorKey, BodyColorDefault);
            if (bodyColor != BodyColorDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.BodyColor == bodyColor);
            }

            return list;
        }

        private IQueryable<Advertisements> whereGearbox(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            GearboxType gearboxType = AdvertisementTransportation.GetGearboxType(
                ParameterExtractor.ExtractString(queryParameters, GearboxKey,
                    AdvertisementTransportation.GetGearboxTypeString(GearboxDefault)),
                GearboxDefault);
            if (gearboxType != GearboxDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.Gearbox ==
                    AdvertisementTransportation.GetGearboxTypeString(gearboxType));
            }
            return list;
        }

        private IQueryable<Advertisements> whereMileage(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            int mileageFrom = ParameterExtractor.ExtractInt(queryParameters, MileageFromKey, MileageFromDefault);
            int mileageTo = ParameterExtractor.ExtractInt(queryParameters, MileageToKey, MileageToDefault);

            if (mileageFrom != MileageFromDefault)
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Mileage >= mileageFrom);

            if (mileageTo != MileageToDefault)
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Mileage <= mileageTo);

            return list;
        }

        private IQueryable<Advertisements> whereClauseFuel(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            FuelType fuelType = AdvertisementTransportation.GetFuelType(
                ParameterExtractor.ExtractString(queryParameters, FuelTypeKey, AdvertisementTransportation.GetFuelTypeString(FuelTypeDefault)),
                FuelTypeDefault);
            if (fuelType != FuelTypeDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.Fuel == AdvertisementTransportation.GetFuelTypeString(fuelType));
            }

            return list;
        }

        private IQueryable<Advertisements> whereClauseMakeYear(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            int makeYearFrom = ParameterExtractor.ExtractInt(queryParameters, MakeYearFromKey, MakeYearFromDefault);
            int makeYearTo = ParameterExtractor.ExtractInt(queryParameters, MakeYearToKey, MakeYearToDefault);

            if (makeYearFrom != MakeYearFromDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.MakeYear >= makeYearFrom);
            }
            if (makeYearTo != MakeYearToDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.MakeYear <= makeYearTo);
            }

            return list;
        }

        private IQueryable<Advertisements> whereClauseCarModelAndBrand(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            int carModelId = ParameterExtractor.ExtractInt(queryParameters, CarModelIdKey, CarModelIdDefault);
            int brandId = ParameterExtractor.ExtractInt(queryParameters, CarBrandIdKey, CarBrandIdDefault);

            if (carModelId != CarModelIdDefault)//when carModel is selected certainly brand is selected
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Model.ModelId == carModelId);
            }
            else if (brandId != CarBrandIdDefault && carModelId == CarModelIdDefault)//just brand is selected
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Model.BrandId == brandId);//apply brandId filter
            }
            //not brand nor model selected do nothing on the list
            return list;

        }



        public async Task<Guid> Add(Dictionary<string, string> userInputDictionary, string userId)
        {
            Advertisements ad = _commonRepository.GetAdvertisementsFromUserInputDictionary(userInputDictionary);
            AdAttributeTransportation adAttribute = getAdAttributeTransportationFromUserInputDictionary(userInputDictionary);

            ad.AdStatusId = 1; //submitted TODO use AdvertisementCommon Class to set it from an enum
            ad.AdId = Guid.NewGuid();
            ad.AdInsertDateTime = DateTime.Now;
            ad.UserId = userId;
            ad.AdNumberOfVisited = 0;//just being added

            adAttribute.AdId = ad.AdId;

           
            _adDbContext.Advertisements.Add(ad);
            await _adDbContext.SaveChangesAsync();

            _adDbContext.AdAttributeTransportation.Add(adAttribute);
            await _adDbContext.SaveChangesAsync();


            return ad.AdId;
        }

        //TODO maybe this is a method of AdAttributeTransportation class
        private AdAttributeTransportation getAdAttributeTransportationFromUserInputDictionary(Dictionary<string, string> userInputDictionary)
        {
            AdAttributeTransportation adAttribute = new AdAttributeTransportation();
            adAttribute.ModelId = ParameterExtractor.ExtractInt(userInputDictionary, CarModelIdKey, CarModelIdDefault);
            adAttribute.MakeYear = ParameterExtractor.ExtractInt(userInputDictionary, MakeYearKey, MakeYearDefault);
            adAttribute.Fuel = ParameterExtractor.ExtractString(userInputDictionary, FuelTypeKey,AdvertisementTransportation.GetFuelTypeString(FuelTypeDefault));
            adAttribute.Mileage = ParameterExtractor.ExtractInt(userInputDictionary, MileageKey, MileageDefault);
            adAttribute.Gearbox = ParameterExtractor.ExtractString(userInputDictionary, GearboxKey,
                AdvertisementTransportation.GetGearboxTypeString(GearboxDefault));
            adAttribute.BodyColor =
                ParameterExtractor.ExtractString(userInputDictionary, BodyColorKey, BodyColorDefault);
            adAttribute.InternalColor =
                ParameterExtractor.ExtractString(userInputDictionary, InternalColorKey, InternalColorDefault);
            adAttribute.BodyStatus = ParameterExtractor.ExtractString(userInputDictionary, BodyStatusKey,
                AdvertisementTransportation.GetBodyStatusString(BodyStatusDefault));
            adAttribute.CarStatus = ParameterExtractor.ExtractString(userInputDictionary, CarStatusKey,
                AdvertisementTransportation.GetCarStatusString(CarStatusDefault));
            adAttribute.PlateType = ParameterExtractor.ExtractString(userInputDictionary, PlateTypeKey, AdvertisementTransportation.GetPlateTypeString(PlateTypeDefault));
            
            return adAttribute;
        }


        //TODO the method implementation is not complete
        private AdAttributeTransportation getAdAtribute(AdvertisementTransportation entity)
        {
            AdAttributeTransportation adAttribute = new AdAttributeTransportation();
            adAttribute.AdId = entity.AdvertisementCommon.AdvertisementId;
            adAttribute.ModelId = entity.ModelId;
            adAttribute.MakeYear = entity.MakeYear;
            adAttribute.Fuel = AdvertisementTransportation.GetFuelTypeString(entity.Fuel);
            adAttribute.Mileage = entity.Mileage;
            adAttribute.Gearbox = entity.Gearbox;
            adAttribute.BodyColor = entity.BodyColor;
            adAttribute.InternalColor = entity.InternalColor;
            adAttribute.BodyStatus = entity.BodyStatus.ToString();

            return adAttribute;
        }

        public void Remove(AdvertisementTransportation entity)// entity only has advertisementCommon attributes
        {
            using (SqlConnection connection = new SqlConnection(""))// _conectionString))
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
            using (SqlConnection connection = new SqlConnection(""))// _conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_saveAdTransportation", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    //fillAddCommandParameters(command, entity);
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
            List<AdvertisementTransportation> searchResultItems = new List<AdvertisementTransportation>();


            RepositoryResponse responseBase;

            using (SqlConnection connection = new SqlConnection(""))// _conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_findAllAdTransport", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    try
                    {
                        connection.Open();
                        SqlDataReader dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
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
            AdvertisementTransportation advertisementTransportation = new AdvertisementTransportation();

            IQueryable<Advertisements> list = _adDbContext.Advertisements
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
                .Where(advertisement => advertisement.AdStatusId == 3 && advertisement.AdId == adId);//only accepted ads

            //TODO verify that good query is generated
            string query = list.ToSql();
            Advertisements item = list.FirstOrDefault();
            fillAdTransportation(advertisementTransportation, item);

            return advertisementTransportation;
        }

        private void fillAdTransportation(AdvertisementTransportation adTrans, Advertisements advertisements)
        {
            adTrans.AdvertisementCommon =
                _commonRepository.GetAdvertisementCommonFromDatabaseResult(advertisements);
            adTrans.BodyColor = advertisements.AdAttributeTransportation.BodyColor;
            adTrans.InternalColor = advertisements.AdAttributeTransportation.InternalColor;
            adTrans.BodyStatus = AdvertisementTransportation.GetBodyStatus(advertisements.AdAttributeTransportation.BodyStatus, BodyStatusDefault);
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
                advertisementTransportation.Fuel = AdvertisementTransportation.GetFuelType((string)dataReader["fuel"], FuelTypeDefault);
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
        public IEnumerable<AdvertisementTransportation> GetUserAdvertisements(string userEmail)
        {
            throw new NotImplementedException();
        }
    }
}
