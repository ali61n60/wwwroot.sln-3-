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
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Helper;
using RepositoryStd.Context.Identity;
using RepositoryStd.ModelConversion;

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

        //TODO remove or use EF
        public IEnumerable<AdvertisementTransportation> FindAll()
        {
            List<AdvertisementTransportation> searchResultItems = new List<AdvertisementTransportation>();

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
                            //responseBase = fillAdvertisementTransportationFromDataReader(tempAdvertisementTransportation, dataReader);
                            //if (!responseBase.Success)
                            //{
                            //    throw new Exception(responseBase.Message);
                            //}
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

        public AdvertisementTransportation FindBy(Guid adId)
        {
            AdvertisementTransportation advertisementTransportation = new AdvertisementTransportation();

            //TODO verify that good query is generated
            IQueryable<Advertisement> list = _adDbContext.Advertisements
                .Include(advertisement => advertisement.Category)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivilege)
                .Include(advertisement => advertisement.FixedPrice)
                .Include(advertisements => advertisements.AdAttributeTransportation)
                .Include(advertisements => advertisements.AdAttributeTransportation.CarModel)
                .Include(advertisements => advertisements.AdAttributeTransportation.CarModel.Brand)
                .Where(advertisement => advertisement.AdStatus == AdStatus.Approved && advertisement.AdId == adId);//only accepted ads
            
            Advertisement item = list.FirstOrDefault();
            fillAdTransportation(advertisementTransportation, item);

            return advertisementTransportation;
        }

        public IEnumerable<AdvertisementCommon> FindAdvertisementCommons(Dictionary<string, string> queryParameters)
        {
            List<AdvertisementCommon> searchResultItems = new List<AdvertisementCommon>();
            IQueryable<Advertisement> list = _commonRepository.GetCommonQueryableList(queryParameters);
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
            foreach (Advertisement advertisement in list)
            {
                AdvertisementCommon tempAdCommon = new AdvertisementCommon();
                Convertor.FillAdvertisementCommonFromAdvertisement( tempAdCommon, advertisement, _appIdentityDbContext);
                searchResultItems.Add(tempAdCommon);
            }

            return searchResultItems;
        }
       
        public async Task Add(Dictionary<string, string> userInputDictionary, string userId)
        {
            Advertisement ad = _commonRepository.GetAdvertisementsFromUserInputDictionary(userInputDictionary);
            AdAttributeTransportation adAttribute = getAdAttributeTransportationFromUserInputDictionary(userInputDictionary);

            ad.AdStatus = AdStatus.Submitted; //submitted TODO use AdvertisementCommon Class to set it from an enum
            ad.AdId = Guid.Parse(ParameterExtractor.ExtractString(userInputDictionary, "NewAdGuid",
                new Guid().ToString()));
            ad.AdInsertDateTime = DateTime.Now;
            ad.UserId = userId;
            ad.AdNumberOfVisited = 0;//just being added

            adAttribute.AdId = ad.AdId;

            _adDbContext.Advertisements.Add(ad);
            await _adDbContext.SaveChangesAsync();

            _adDbContext.AdAttributeTransportation.Add(adAttribute);
            await _adDbContext.SaveChangesAsync();
        }

        public AdvertisementCommon GetAdDetail(Guid adGuid)
        {
            return FindBy(adGuid);
        }

        public async Task AddLetMeKnow(Dictionary<string, string> userInputDictionary, string userId)
        {
            LetMeKnow tempLetMeKnow = _commonRepository.GetLetMeKnowFormUserInput(userInputDictionary, userId);
            LetMeKnowAttributeTransportaion letMeKnowAttributeTransportaion =
                getLetMeKnowAttributeTransportaionFromUserInputDictionary(userInputDictionary);
            _adDbContext.LetMeKnows.Add(tempLetMeKnow);
            await _adDbContext.SaveChangesAsync();
            letMeKnowAttributeTransportaion.Id = tempLetMeKnow.Id;
            _adDbContext.LetMeKnowAttributeTransportaions.Add(letMeKnowAttributeTransportaion);
            await _adDbContext.SaveChangesAsync();
        }

        public bool CriteriaMatch(ApprovedAd approvedAd, LetMeKnow letMeKnow)
        {
            AdAttributeTransportation approvedadAttributeTransportation = _adDbContext.AdAttributeTransportation
                .Include(tr=>tr.CarModel)
                .Include(tr=>tr.CarModel.Brand)
                .FirstOrDefault(transportation =>
                transportation.AdId == approvedAd.AdId);
            LetMeKnowAttributeTransportaion letMeKnowAttributeTransportaion = _adDbContext.LetMeKnowAttributeTransportaions.FirstOrDefault(let => let.Id == letMeKnow.Id);
            if (approvedadAttributeTransportation == null || letMeKnowAttributeTransportaion == null)
            {
                return false;
            }

            if (letMeKnowCarBrandAndModelMatch( approvedadAttributeTransportation, letMeKnowAttributeTransportaion)
                && letMeKnowMakeYearMatch(approvedadAttributeTransportation, letMeKnowAttributeTransportaion))
            {
                return true;
            }
            
            return false;
            
        }

        private bool letMeKnowCarBrandAndModelMatch(AdAttributeTransportation approvedadAttributeTransportation, LetMeKnowAttributeTransportaion letMeKnowAttributeTransportaion)
        {
            CarModel approvedCarModel = approvedadAttributeTransportation.CarModel;
            Brand approvedBrand = approvedCarModel.Brand;

            int? letMeKnowBrandId = letMeKnowAttributeTransportaion.BrandId;
            int? letMeKnowCarModelId = letMeKnowAttributeTransportaion.ModelId;
            if ((letMeKnowBrandId == CarBrandIdDefault) ||
                (letMeKnowBrandId == approvedBrand.BrandId && letMeKnowCarModelId == CarModelIdDefault) ||
                (letMeKnowCarModelId == approvedCarModel.ModelId))
            {
                return true;
            }
            return false;
        }

        private bool letMeKnowMakeYearMatch(AdAttributeTransportation approvedadAttributeTransportation, LetMeKnowAttributeTransportaion letMeKnowAttributeTransportaion)
        {
            int? approvedMakeYear = approvedadAttributeTransportation.MakeYear;
            int? letMeMakeYearFrom = letMeKnowAttributeTransportaion.MakeYearFrom;
            int? letMeMakeYearTo = letMeKnowAttributeTransportaion.MakeYearTo;

            if (approvedMakeYear >= letMeMakeYearFrom && approvedMakeYear <= letMeMakeYearTo)
            {
                return true;
            }
            return false;
        }

        private LetMeKnowAttributeTransportaion getLetMeKnowAttributeTransportaionFromUserInputDictionary(Dictionary<string, string> userInputDictionary)
        {
            LetMeKnowAttributeTransportaion tempLetMeKnowAttributeTransportaion=new LetMeKnowAttributeTransportaion();
            tempLetMeKnowAttributeTransportaion.BrandId =ParameterExtractor.ExtractInt(userInputDictionary, CarBrandIdKey, CarBrandIdDefault);
            tempLetMeKnowAttributeTransportaion.ModelId =ParameterExtractor.ExtractInt(userInputDictionary, CarModelIdKey, CarModelIdDefault);

            tempLetMeKnowAttributeTransportaion.MakeYearFrom =
                ParameterExtractor.ExtractInt(userInputDictionary, MakeYearFromKey, MakeYearFromDefault);

            tempLetMeKnowAttributeTransportaion.MakeYearTo =
                ParameterExtractor.ExtractInt(userInputDictionary, MakeYearToKey, MakeYearToDefault);

            return tempLetMeKnowAttributeTransportaion;
        }

        //TODO maybe this is a method of AdAttributeTransportation class
        private AdAttributeTransportation getAdAttributeTransportationFromUserInputDictionary(Dictionary<string, string> userInputDictionary)
        {
            AdAttributeTransportation adAttribute = new AdAttributeTransportation();
            adAttribute.ModelId = ParameterExtractor.ExtractInt(userInputDictionary, CarModelIdKey, CarModelIdDefault);
            adAttribute.MakeYear = ParameterExtractor.ExtractInt(userInputDictionary, MakeYearKey, MakeYearDefault);
            adAttribute.Fuel = ParameterExtractor.ExtractString(userInputDictionary, FuelTypeKey, AdvertisementTransportation.GetFuelTypeString(FuelTypeDefault));
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
            adAttribute.AdId = entity.AdId;
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

       
        private IQueryable<Advertisement> wherePlateType(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
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
        private IQueryable<Advertisement> whereCarStatus(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
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
        private IQueryable<Advertisement> whereBodyStatus(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
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
        private IQueryable<Advertisement> whereInternalColor(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            string internalColor = ParameterExtractor.ExtractString(queryParameters, InternalColorKey, InternalColorDefault);
            if (internalColor != InternalColorDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.InternalColor == internalColor);
            }

            return list;
        }
        private IQueryable<Advertisement> whereBodyColor(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            string bodyColor = ParameterExtractor.ExtractString(queryParameters, BodyColorKey, BodyColorDefault);
            if (bodyColor != BodyColorDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.BodyColor == bodyColor);
            }

            return list;
        }
        private IQueryable<Advertisement> whereGearbox(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
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
        private IQueryable<Advertisement> whereMileage(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            int mileageFrom = ParameterExtractor.ExtractInt(queryParameters, MileageFromKey, MileageFromDefault);
            int mileageTo = ParameterExtractor.ExtractInt(queryParameters, MileageToKey, MileageToDefault);

            if (mileageFrom != MileageFromDefault)
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Mileage >= mileageFrom);

            if (mileageTo != MileageToDefault)
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Mileage <= mileageTo);

            return list;
        }
        private IQueryable<Advertisement> whereClauseFuel(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
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
        private IQueryable<Advertisement> whereClauseMakeYear(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
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
        private IQueryable<Advertisement> whereClauseCarModelAndBrand(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            int carModelId = ParameterExtractor.ExtractInt(queryParameters, CarModelIdKey, CarModelIdDefault);
            int brandId = ParameterExtractor.ExtractInt(queryParameters, CarBrandIdKey, CarBrandIdDefault);

            if (carModelId != CarModelIdDefault)//when carModel is selected certainly brand is selected
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.CarModel.ModelId == carModelId);
            }
            else if (brandId != CarBrandIdDefault && carModelId == CarModelIdDefault)//just brand is selected
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.CarModel.BrandId == brandId);//apply brandId filter
            }
            //not brand nor model selected do nothing on the list
            return list;

        }
        
        private void fillAdTransportation(AdvertisementTransportation adTrans, Advertisement advertisement)
        {
            Convertor.FillAdvertisementCommonFromAdvertisement(adTrans,advertisement, _appIdentityDbContext);
            adTrans.BodyColor = advertisement.AdAttributeTransportation.BodyColor;
            adTrans.InternalColor = advertisement.AdAttributeTransportation.InternalColor;
            adTrans.BodyStatus = AdvertisementTransportation.GetBodyStatus(advertisement.AdAttributeTransportation.BodyStatus, BodyStatusDefault);
            adTrans.BrandId = advertisement.AdAttributeTransportation.CarModel.BrandId;
            adTrans.BrandName = advertisement.AdAttributeTransportation.CarModel.Brand.BrandName;
            adTrans.ModelName = advertisement.AdAttributeTransportation.CarModel.ModelName;
            adTrans.Gearbox = advertisement.AdAttributeTransportation.Gearbox;

            if (advertisement.AdAttributeTransportation.Mileage != null)
                adTrans.Mileage = advertisement.AdAttributeTransportation.Mileage.Value;
            else
                adTrans.Mileage = -1;

            if (advertisement.AdAttributeTransportation.MakeYear != null)
                adTrans.MakeYear = advertisement.AdAttributeTransportation.MakeYear.Value;
            else
                adTrans.MakeYear = -1;
        }
        
    }
}
