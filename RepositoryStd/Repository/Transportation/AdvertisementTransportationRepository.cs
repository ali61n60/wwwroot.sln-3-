﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;
using ModelStd.IRepository;
using ModelStd.Services;
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Identity;

namespace RepositoryStd.Repository.Transportation
{
    //TODO add CarStatus and PlateType to database table
    public class AdvertisementTransportationRepository : IRepository<AdvertisementTransportation>, IAdRepository
    {
        //AdTransportation Properties

        
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
            AppUser appUser = _appIdentityDbContext.Users.FirstOrDefault(user => user.Id == item.UserId);
            AdAttributeTransportation.FillAdTransportationFromAdvertisement(advertisementTransportation, item,appUser);

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
                AppUser appUser = _appIdentityDbContext.Users.FirstOrDefault(user => user.Id == advertisement.UserId);
                Advertisement.FillAdvertisementCommonFromAdvertisement( tempAdCommon, advertisement, appUser);
                searchResultItems.Add(tempAdCommon);
            }

            return searchResultItems;
        }
       
        public async Task Add(Dictionary<string, string> userInputDictionary, string userId)
        {
            //TODO check if context is not tracking the ad
            Guid userSentGuid =
                Guid.Parse(Extractor.ExtractString(userInputDictionary, "NewAdGuid", new Guid().ToString()));
            IEnumerable<EntityEntry<Advertisement>> trackingAds= _adDbContext.ChangeTracker.Entries<Advertisement>().Where(entry => entry.Entity.AdId == userSentGuid);
            if (trackingAds.Count() != 0)
            {
                foreach (var entity in trackingAds)
                {
                    _adDbContext.Entry(entity.Entity).State = EntityState.Detached;
                }
            }
            Advertisement ad = _commonRepository.GetAdvertisementsFromUserInputDictionary(userInputDictionary);
            AdAttributeTransportation adAttribute = getAdAttributeTransportationFromUserInputDictionary(userInputDictionary);

            ad.AdStatus = AdStatus.Submitted; //submitted TODO use AdvertisementCommon Class to set it from an enum
            ad.AdId = Guid.Parse(Extractor.ExtractString(userInputDictionary, "NewAdGuid",new Guid().ToString()));
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
            if ((letMeKnowBrandId == AdAttributeTransportation.CarBrandIdDefault) ||
                (letMeKnowBrandId == approvedBrand.BrandId && letMeKnowCarModelId == AdAttributeTransportation.CarModelIdDefault) ||
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
            tempLetMeKnowAttributeTransportaion.BrandId =Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.CarBrandIdKey, AdAttributeTransportation.CarBrandIdDefault);
            tempLetMeKnowAttributeTransportaion.ModelId =Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.CarModelIdKey, AdAttributeTransportation.CarModelIdDefault);

            tempLetMeKnowAttributeTransportaion.MakeYearFrom =
                Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.MakeYearFromKey, AdAttributeTransportation.MakeYearFromDefault);

            tempLetMeKnowAttributeTransportaion.MakeYearTo =
                Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.MakeYearToKey, AdAttributeTransportation.MakeYearToDefault);

            return tempLetMeKnowAttributeTransportaion;
        }

        //TODO maybe this is a method of AdAttributeTransportation class
        private AdAttributeTransportation getAdAttributeTransportationFromUserInputDictionary(Dictionary<string, string> userInputDictionary)
        {
            AdAttributeTransportation adAttribute = new AdAttributeTransportation();
            adAttribute.ModelId = Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.CarModelIdKey, AdAttributeTransportation.CarModelIdDefault);
            adAttribute.MakeYear = Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.MakeYearKey, AdAttributeTransportation.MakeYearDefault);
            adAttribute.FuelType =(FuelType)Enum.ToObject(typeof(FuelType),Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.FuelTypeKey, (int)AdAttributeTransportation.FuelTypeDefault));
            adAttribute.Mileage = Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.MileageKey, AdAttributeTransportation.MileageDefault);
            adAttribute.GearboxType =(GearboxType)Enum.ToObject(typeof(GearboxType), Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.GearboxKey,(int)AdAttributeTransportation.GearboxDefault));
            adAttribute.BodyColor =Extractor.ExtractString(userInputDictionary, AdAttributeTransportation.BodyColorKey, AdAttributeTransportation.BodyColorDefault);
            adAttribute.InternalColor =Extractor.ExtractString(userInputDictionary, AdAttributeTransportation.InternalColorKey, AdAttributeTransportation.InternalColorDefault);
            adAttribute.BodyStatus =(BodyStatus)Enum.ToObject(typeof(BodyStatus), Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.BodyStatusKey,(int)AdAttributeTransportation.BodyStatusDefault));
            adAttribute.CarStatus =(CarStatus)Enum.ToObject(typeof(CarStatus), Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.CarStatusKey,(int)AdAttributeTransportation.CarStatusDefault));
            adAttribute.PlateType =(PlateType)Enum.ToObject(typeof(PlateType),Extractor.ExtractInt(userInputDictionary, AdAttributeTransportation.PlateTypeKey, (int)AdAttributeTransportation.PlateTypeDefault));

            return adAttribute;
        }
                      
        private IQueryable<Advertisement> wherePlateType(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            PlateType plateType =(PlateType)Enum.ToObject( typeof(PlateType),Extractor.ExtractInt(queryParameters, AdAttributeTransportation.PlateTypeKey,(int)AdAttributeTransportation.PlateTypeDefault));
            if (plateType != AdAttributeTransportation.PlateTypeDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.PlateType ==plateType);
            }
            return list;
        }
        private IQueryable<Advertisement> whereCarStatus(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            CarStatus carStatus = (CarStatus)Enum.ToObject(typeof(CarStatus), Extractor.ExtractInt(queryParameters, AdAttributeTransportation.CarStatusKey, (int)AdAttributeTransportation.CarStatusDefault));
            
            if (carStatus != AdAttributeTransportation.CarStatusDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.CarStatus ==carStatus);
            }

            return list;
        }
        private IQueryable<Advertisement> whereBodyStatus(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            //TODO get BodyStatus as an integer from user
            BodyStatus bodyStatus = (BodyStatus)Enum.ToObject(typeof(BodyStatus), Extractor.ExtractInt(queryParameters, AdAttributeTransportation.BodyStatusKey, (int)AdAttributeTransportation.BodyStatusDefault));
            
            if (bodyStatus != AdAttributeTransportation.BodyStatusDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.BodyStatus ==bodyStatus);
            }
            return list;
        }
        private IQueryable<Advertisement> whereInternalColor(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            string internalColor = Extractor.ExtractString(queryParameters, AdAttributeTransportation.InternalColorKey, AdAttributeTransportation.InternalColorDefault);
            if (internalColor != AdAttributeTransportation.InternalColorDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.InternalColor == internalColor);
            }

            return list;
        }
        private IQueryable<Advertisement> whereBodyColor(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            string bodyColor = Extractor.ExtractString(queryParameters, AdAttributeTransportation.BodyColorKey, AdAttributeTransportation.BodyColorDefault);
            if (bodyColor != AdAttributeTransportation.BodyColorDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.BodyColor == bodyColor);
            }

            return list;
        }
        private IQueryable<Advertisement> whereGearbox(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            //TODO get gearboxType as an integer from user
            GearboxType gearboxType = (GearboxType)Enum.ToObject(typeof(GearboxType), Extractor.ExtractInt(queryParameters, AdAttributeTransportation.GearboxKey, (int)AdAttributeTransportation.GearboxDefault));
            
            if (gearboxType != AdAttributeTransportation.GearboxDefault)
            {
                list = list.Where(advertisement =>advertisement.AdAttributeTransportation.GearboxType ==gearboxType);
            }
            return list;
        }
        private IQueryable<Advertisement> whereMileage(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            int mileageFrom = Extractor.ExtractInt(queryParameters, AdAttributeTransportation.MileageFromKey, AdAttributeTransportation.MileageFromDefault);
            int mileageTo = Extractor.ExtractInt(queryParameters, AdAttributeTransportation.MileageToKey, AdAttributeTransportation.MileageToDefault);

            if (mileageFrom != AdAttributeTransportation.MileageFromDefault)
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Mileage >= mileageFrom);

            if (mileageTo != AdAttributeTransportation.MileageToDefault)
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.Mileage <= mileageTo);

            return list;
        }
        private IQueryable<Advertisement> whereClauseFuel(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {

            //TODO get fuelType as an integer from user
            FuelType fuelType = (FuelType)Enum.ToObject(typeof(FuelType), Extractor.ExtractInt(queryParameters, AdAttributeTransportation.FuelTypeKey, (int)AdAttributeTransportation.FuelTypeDefault));
            
            if (fuelType != AdAttributeTransportation.FuelTypeDefault)
            {
                list = list.Where(advertisement =>
                    advertisement.AdAttributeTransportation.FuelType == fuelType);
            }

            return list;
        }
        private IQueryable<Advertisement> whereClauseMakeYear(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            int makeYearFrom = Extractor.ExtractInt(queryParameters, AdAttributeTransportation.MakeYearFromKey, AdAttributeTransportation.MakeYearFromDefault);
            int makeYearTo = Extractor.ExtractInt(queryParameters, AdAttributeTransportation.MakeYearToKey, AdAttributeTransportation.MakeYearToDefault);

            if (makeYearFrom != AdAttributeTransportation.MakeYearFromDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.MakeYear >= makeYearFrom);
            }
            if (makeYearTo != AdAttributeTransportation.MakeYearToDefault)
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.MakeYear <= makeYearTo);
            }

            return list;
        }
        private IQueryable<Advertisement> whereClauseCarModelAndBrand(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            int carModelId = Extractor.ExtractInt(queryParameters, AdAttributeTransportation.CarModelIdKey, AdAttributeTransportation.CarModelIdDefault);
            int brandId = Extractor.ExtractInt(queryParameters, AdAttributeTransportation.CarBrandIdKey, AdAttributeTransportation.CarBrandIdDefault);

            if (carModelId != AdAttributeTransportation.CarModelIdDefault)//when carModel is selected certainly brand is selected
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.CarModel.ModelId == carModelId);
            }
            else if (brandId != AdAttributeTransportation.CarBrandIdDefault && carModelId == AdAttributeTransportation.CarModelIdDefault)//just brand is selected
            {
                list = list.Where(advertisement => advertisement.AdAttributeTransportation.CarModel.BrandId == brandId);//apply brandId filter
            }
            //not brand nor model selected do nothing on the list
            return list;

        }
        
        
        
    }
}
