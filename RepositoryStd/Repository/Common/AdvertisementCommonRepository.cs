﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using ModelStd.Services;
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Helper;
using RepositoryStd.Context.Identity;


namespace RepositoryStd.Repository.Common
{
    public class AdvertisementCommonRepository : IRepository<AdvertisementCommon>, IAdRepository, ICommonRepository
    {
        //Common Properties

        public static readonly string CategoryIdKey = "CategoryId";
        public static readonly int CategoryIdDefault = 0;

        public static readonly string StartIndexKey = "StartIndex";
        public static readonly int StartIndexDefault = 1;

        public static readonly string CountKey = "Count";
        public static readonly int CountDefault = 5;
        public static readonly int MinCount = 1;
        public static readonly int MaxCount = 20;

        public static readonly string PriceTypeKey = "PriceType";
        public static readonly PriceType PriceTypeDefault = PriceType.All;

        public static readonly string MinPriceKey = "MinimumPrice";
        public static readonly decimal MinPriceDefault = -1;

        public static readonly string MaxPriceKey = "MaximumPrice";
        public static readonly decimal MaxPriceDefault = 1000000000000;

        public static readonly string DistrictIdKey = "DistrictId";
        public static readonly List<int> ListDistrctIdDefault = new List<int>();
        public static readonly int SingleDistrctIdDefault = 1;

        public static readonly string OrderByKey = "OrderBy";
        public static readonly OrderBy OrderByDefault = OrderBy.DateAsc;

        public static readonly string AdTitleKey = "AdTitle";
        public static readonly string AddTitleDefault = "Default Title";

        public static readonly string AdCommentKey = "AdComment";
        public static readonly string AdCommentDefault = "Default Comment";

        public static readonly string EmailOrSmsKey = "EmailOrSms";
        public static readonly int EmailOrSmsDefault = 1;

        private readonly ICategoryRepository _categoryRepository;
        private readonly AdDbContext _adDbContext;
        private readonly AppIdentityDbContext _appIdentityDbContext;

        public AdvertisementCommonRepository(AdDbContext adDbContext,
            AppIdentityDbContext appIdentityDbContext, ICategoryRepository categoryRepository)
        {
            _adDbContext = adDbContext;
            _appIdentityDbContext = appIdentityDbContext;
            _categoryRepository = categoryRepository;
        }


        //Called from service layer
        public IEnumerable<AdvertisementCommon> FindAdvertisementCommons(Dictionary<string, string> queryParameters)
        {
            List<AdvertisementCommon> searchResultItems = new List<AdvertisementCommon>();
            IQueryable<Advertisements> list = GetCommonQueryableList(queryParameters);

            //uegentOnly

            list = EnforceStartIndexAndCount(queryParameters, list);
            foreach (Advertisements advertisement in list)
            {
                AdvertisementCommon temp = new AdvertisementCommon();
                FillAdvertisementCommonFromDatabaseResult(advertisement, temp);
                searchResultItems.Add(temp);
            }
            return searchResultItems;
        }

        public IQueryable<Advertisements> EnforceStartIndexAndCount(Dictionary<string, string> queryParameters, IQueryable<Advertisements> list)
        {
            int startIndex = ParameterExtractor.ExtractInt(queryParameters, StartIndexKey, StartIndexDefault);
            if (startIndex < 0)
                startIndex = StartIndexDefault;

            int count = ParameterExtractor.ExtractInt(queryParameters, CountKey, CountDefault);
            if (count > MaxCount)
                count = MaxCount;
            else if (count < MinCount)
                count = MinCount;

            return (IOrderedQueryable<Advertisements>)list.Skip(startIndex - 1).Take(count);
        }


        public IQueryable<Advertisements> GetCommonQueryableList(Dictionary<string, string> queryParameters)
        {
            IQueryable<Advertisements> list = _adDbContext.Advertisements
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

       
        public void FillAdvertisementCommonFromDatabaseResult(Advertisements advertisement, AdvertisementCommon adCommon)
        {

            adCommon.AdvertisementId = advertisement.AdId;
            adCommon.UserId = advertisement.UserId;
            adCommon.AdvertisementTitle = advertisement.AdTitle;
            adCommon.AdvertisementTime = advertisement.AdInsertDateTime;
            adCommon.AdvertisementStatusId = advertisement.AdStatusId;
            if(advertisement.AdStatus!=null) adCommon.AdvertisementStatus = advertisement.AdStatus.AdStatus1;
            if(advertisement.Category!=null) adCommon.AdvertisementCategory = advertisement.Category.CategoryName;
            adCommon.AdvertisementCategoryId = advertisement.CategoryId;
            adCommon.AdvertisementComments = advertisement.AdComments;
            adCommon.NumberOfVisit = advertisement.AdNumberOfVisited;
            adCommon.Email = _appIdentityDbContext.Users.First(user => user.Id == advertisement.UserId).Email;//TODO test for null
            adCommon.PhoneNumber = _appIdentityDbContext.Users.First(user => user.Id == advertisement.UserId).PhoneNumber;//TODO test for null
            adCommon.DistrictId = advertisement.DistrictId;
            if(advertisement.District!=null) adCommon.DistrictName = advertisement.District.DistrictName;
            if(advertisement.District != null && advertisement.District.City != null) adCommon.CityName = advertisement.District.City.CityName;
            if (advertisement.District != null && advertisement.District.City != null && advertisement.District.City.Province != null)
                adCommon.ProvinceName = advertisement.District.City.Province.ProvinceName;
            if(advertisement.Price!=null) adCommon.AdvertisementPrice = advertisement.Price;

            if(adCommon.AdvertisementPrice!=null) adCommon.AdvertisementPrice.Ad = null;//prevent self referencing
        }

        //TODO maybe it is a method of Advertisements class
        public Advertisements GetAdvertisementsFromUserInputDictionary(Dictionary<string, string> userInputDictionary)
        {
            Advertisements ad = new Advertisements();
            ad.CategoryId = ParameterExtractor.ExtractInt(userInputDictionary, CategoryIdKey, CategoryIdDefault);
            ad.DistrictId = ParameterExtractor.ExtractInt(userInputDictionary, DistrictIdKey, SingleDistrctIdDefault);
            ad.AdTitle = ParameterExtractor.ExtractString(userInputDictionary, AdTitleKey, AddTitleDefault);
            ad.AdComments = ParameterExtractor.ExtractString(userInputDictionary, AdCommentKey, AdCommentDefault);
            ad.AdLink = "ToBeSet";

            return ad;
        }

        public async Task Add(Dictionary<string, string> userInputDictionary, string userId)
        {
            throw new Exception("Cannot Insert a new ad from AdvertisementCommonRepository");
        }
        
        public AdvertisementCommon GetAdDetail(Guid adGuid)
        {
            return FindBy(adGuid);
        }

        public async Task AddLetMeKnow(Dictionary<string, string> userInputDictionary, string userId)
        {
            throw new Exception("Cannot Add LetMeKnow from advertisementCommonRepository");
        }

        public bool CriteriaMatch(ApprovedAd approvedAd, LetMeKnow letMeKnow)
        {
            AdAttributeTransportation approvedadAttributeTransportation = _adDbContext.AdAttributeTransportation.FirstOrDefault(transportation =>
                transportation.AdId == approvedAd.AdId);
            LetMeKnowAttributeTransportaion letMeKnowAttributeTransportaion = _adDbContext.LetMeKnowAttributeTransportaions.FirstOrDefault(let => let.Id == letMeKnow.Id);
            if (approvedadAttributeTransportation == null || letMeKnowAttributeTransportaion==null)
            {
                return false;
            }
            CarModel approvedCarModel = approvedadAttributeTransportation.Model;
            Brand approvedBrand = approvedCarModel.Brand;

            int letMeKnowBrandId= letMeKnowAttributeTransportaion.BrandId;
            int letMeKnowCarModelId = letMeKnowAttributeTransportaion.ModelId;
          //  if(let)


            





            return false;
        }

        public LetMeKnow GetLetMeKnowFormUserInput(Dictionary<string, string> userInputDictionary, string userId)
        {
            LetMeKnow tempLetMeKnow = new LetMeKnow();
            tempLetMeKnow.UserId = userId;
            tempLetMeKnow.CategoryId = ParameterExtractor.ExtractInt(userInputDictionary, CategoryIdKey, CategoryIdDefault);
            tempLetMeKnow.EmailOrSms = (EmailOrSms)Enum.Parse(typeof(EmailOrSms), ParameterExtractor.ExtractInt(userInputDictionary, EmailOrSmsKey, EmailOrSmsDefault).ToString());// EmailOrSms.Email;//TODO get it from user
            tempLetMeKnow.RequetsPrivilege = RequetsPrivilege.Normal;//TODO get it from user
            tempLetMeKnow.RequestInsertDateTime = DateTime.Now;
            
            return tempLetMeKnow;
        }

        public async Task<IEnumerable<AdvertisementCommon>> GetUserAdvertisements(string userId)
        {
            List<Advertisements> userAdvertisements = await _adDbContext.Advertisements
                .Include(advertisements => advertisements.AdStatus)
                .Where(advertisements => advertisements.UserId == userId).ToListAsync(CancellationToken.None);
            List<AdvertisementCommon> userAdvertisementCommons = new List<AdvertisementCommon>();
            foreach (Advertisements advertisement in userAdvertisements)
            {
                AdvertisementCommon temp = new AdvertisementCommon();
                FillAdvertisementCommonFromDatabaseResult(advertisement, temp);
                userAdvertisementCommons.Add(temp);
            }

            return userAdvertisementCommons;
        }

        public async Task UpdateAd(Guid adGuid, string userId)
        {
            Advertisements updatingAD= _adDbContext.Advertisements.FirstOrDefault(advertisements =>
                advertisements.AdId == adGuid && advertisements.UserId == userId);
            if(updatingAD!=null)
                updatingAD.AdInsertDateTime=DateTime.Now;
            await _adDbContext.SaveChangesAsync();
            
            return;
        }

        public async Task DeleteAd(Guid adGuid, string userId)
        {
            Advertisements deletingAD = _adDbContext.Advertisements.FirstOrDefault(advertisements =>
                advertisements.AdId == adGuid && advertisements.UserId == userId);
            _adDbContext.Remove(deletingAD);
            await _adDbContext.SaveChangesAsync();

            return;
        }

        public async Task MarkAd(Guid adGuid, string userId)
        {
            MarkedAd adToBeMarked = new MarkedAd()
            {
               AdId = adGuid,
               UserId = userId
            };
            _adDbContext.MarkedAds.Add(adToBeMarked);
            await _adDbContext.SaveChangesAsync();
            return;
        }

        public List<LetMeKnow> GetUserLetMeKnows(string userId)
        {
            return _adDbContext.LetMeKnows.Where(know => know.UserId == userId).ToList();
        }

        public async Task DeleteLetMeKnow(int letMeKnowId, string userId)
        {
            LetMeKnow deletingLetMeKnow = _adDbContext.LetMeKnows.FirstOrDefault(letMeKnow =>
                letMeKnow.Id==letMeKnowId && letMeKnow.UserId == userId);
            if (deletingLetMeKnow != null)
            {
                _adDbContext.Remove(deletingLetMeKnow);
                await _adDbContext.SaveChangesAsync();
            }
        }

        //sp To be removed
        public IEnumerable<AdvertisementCommon> FindAll()
        {
            //TODO remove this method or use EF
            List<AdvertisementCommon> searchResultItems = new List<AdvertisementCommon>();
            using (SqlConnection connection = new SqlConnection(""))// _conectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_findAllAdCommon", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();
                    SqlDataReader sqlDataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    while (sqlDataReader.Read())
                    {
                        AdvertisementCommon tempAdvertisementCommon = new AdvertisementCommon();
                        ResponseBase repositoryResponse=new ResponseBase();// = fillAdvertisementCommonFromDataReader(tempAdvertisementCommon, sqlDataReader);
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

        public AdvertisementCommon FindBy(Guid adId)
        {
            IQueryable<Advertisements> list = _adDbContext.Advertisements
                .Include(advertisement => advertisement.Category)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivilege)
                .Include(advertisement => advertisement.AdStatus)
                .Include(advertisement => advertisement.Price)
                .Where(advertisement => advertisement.AdStatusId == 3 && advertisement.AdId == adId);//only accepted ads

            Advertisements item = list.FirstOrDefault();
            AdvertisementCommon adCommon = new AdvertisementCommon();
            FillAdvertisementCommonFromDatabaseResult(item, adCommon);
            return adCommon;
        }

        public async Task IncrementNumberOfVisit(Guid adGuid)
        {
            //TODO error handling use a server log 
            _adDbContext.Advertisements.FirstOrDefault(advertisements => advertisements.AdId == adGuid).AdNumberOfVisited++;
            _adDbContext.SaveChanges();
        }

        //TODO the method implementation is not complete
        public Advertisements GetAdvertisement(AdvertisementCommon advertisementCommon)
        {
            Advertisements ad = new Advertisements();
            ad.AdComments = advertisementCommon.AdvertisementComments;
            ad.AdId = advertisementCommon.AdvertisementId;
            ad.AdInsertDateTime = advertisementCommon.AdvertisementTime;
            ad.AdNumberOfVisited = advertisementCommon.NumberOfVisit;

            return ad;
        }

        private IQueryable<Advertisements> orderByClause(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            OrderBy orderByUserInput = ParameterExtractor.ExtractOrderBy(queryParameters, OrderByKey, OrderByDefault);
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
            int firstLevelCategoryId = ParameterExtractor.ExtractInt(queryParameters, CategoryIdKey, CategoryIdDefault);
            if (firstLevelCategoryId == 0)//root is selected so do not include anything in where clause
            {
                return list;
            }
            List<int> fullCategoryIdList = new List<int> { firstLevelCategoryId };
            IList<Category> secondLevelCategories = _categoryRepository.GetAllChildernCategories(firstLevelCategoryId);
            List<Category> thirdLevelCategories = new List<Category>();
            foreach (Category secondLevelCategory in secondLevelCategories)
            {
                fullCategoryIdList.Add(secondLevelCategory.CategoryId);
                thirdLevelCategories.AddRange(_categoryRepository.GetAllChildernCategories(secondLevelCategory.CategoryId));
            }

            foreach (Category thirdLevelCategory in thirdLevelCategories)
            {
                fullCategoryIdList.Add(thirdLevelCategory.CategoryId);
            }

            list = list.Where(advertisement => fullCategoryIdList.Contains(advertisement.CategoryId));
            return list;
        }
        private IQueryable<Advertisements> WhereClausePrice(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            decimal minPrice = ParameterExtractor.ExtractDecimal(queryParameters, MinPriceKey, MinPriceDefault);
            if (minPrice < MinPriceDefault)
                minPrice = MinPriceDefault;
            if (minPrice != MinPriceDefault)
                list = list.Where(advertisement => advertisement.Price.price > minPrice);

            decimal maxPrice = ParameterExtractor.ExtractDecimal(queryParameters, MaxPriceKey, MaxPriceDefault);
            if (maxPrice > MaxPriceDefault)
                maxPrice = MaxPriceDefault;
            if (maxPrice != MaxPriceDefault)
                list = list.Where(advertisement => advertisement.Price.price < maxPrice);


            PriceType priceType = ParameterExtractor.ExtractPriceType(queryParameters, PriceTypeKey, PriceTypeDefault);
            if (priceType != PriceTypeDefault)
                list = list.Where(advertisement => advertisement.Price.priceType == Price.ConverPriceTypeToString(priceType));
            return list;
        }
        private IQueryable<Advertisements> whereClauseDistrictId(IQueryable<Advertisements> list, Dictionary<string, string> queryParameters)
        {
            List<int> districtList = ParameterExtractor.ExtractDistrictIds(queryParameters, DistrictIdKey, ListDistrctIdDefault);
            if (districtList.Count > 0)
                list = list.Where(advertisement => districtList.Contains(advertisement.DistrictId));
            return list;
        }



    }
}
