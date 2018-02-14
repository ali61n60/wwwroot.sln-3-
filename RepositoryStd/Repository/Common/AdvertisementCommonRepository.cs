using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Expressions;
using ModelStd.Advertisements;
using ModelStd.Advertisements.Price;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using ModelStd.Services;
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Helper;
using RepositoryStd.Context.Identity;
using RepositoryStd.ModelConversion;


namespace RepositoryStd.Repository.Common
{
    public class AdvertisementCommonRepository : IRepository<AdvertisementCommon>, IAdRepository, ICommonRepository
    {
        //Common Properties

        public static readonly string StartIndexKey = "StartIndex";
        public static readonly int StartIndexDefault = 1;

        public static readonly string CountKey = "Count";
        public static readonly int CountDefault = 5;
        public static readonly int MinCount = 1;
        public static readonly int MaxCount = 20;

        public static readonly string PriceTypeKey = "PriceType";
        public static readonly PriceType PriceTypeDefault = PriceType.All;

        public static readonly string SearchTextKey = "SearchText";
        public static readonly string SearchTextDefault = "";

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
            IQueryable<Advertisement> list = GetCommonQueryableList(queryParameters);

            //uegentOnly

            list = EnforceStartIndexAndCount(queryParameters, list);
            foreach (Advertisement advertisement in list)
            {
                AdvertisementCommon tempAdCommon = new AdvertisementCommon();
                Convertor.FillAdvertisementCommonFromAdvertisement(tempAdCommon, advertisement, _appIdentityDbContext);
                searchResultItems.Add(tempAdCommon);
            }
            return searchResultItems;
        }

        public IQueryable<Advertisement> EnforceStartIndexAndCount(Dictionary<string, string> queryParameters, IQueryable<Advertisement> list)
        {
            int startIndex = ParameterExtractor.ExtractInt(queryParameters, StartIndexKey, StartIndexDefault);
            if (startIndex < 0)
                startIndex = StartIndexDefault;

            int count = ParameterExtractor.ExtractInt(queryParameters, CountKey, CountDefault);
            if (count > MaxCount)
                count = MaxCount;
            else if (count < MinCount)
                count = MinCount;

            return (IOrderedQueryable<Advertisement>)list.Skip(startIndex - 1).Take(count);
        }


        public IQueryable<Advertisement> GetCommonQueryableList(Dictionary<string, string> queryParameters)
        {
            IQueryable<Advertisement> list = _adDbContext.Advertisements
                .Include(advertisement => advertisement.Category)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivilege);
            list = includePrice(list, queryParameters);

            list = list.Where(advertisement => advertisement.AdStatus == AdStatus.Approved); //only accepted ads

            list = orderByClause(list, queryParameters); //OrderBy
            list = whereClauseAdType(list, queryParameters);//AdType
            list = wherClauseCategoryId(list, queryParameters); //Category
            list = whereClauseDistrictId(list, queryParameters); //DistrictId
            list = whereClauseInputText(list, queryParameters);
            return list;
        }

        private IQueryable<Advertisement> whereClauseInputText(IQueryable<Advertisement> list, Dictionary<string, string> queryParameters)
        {
            string userInputSearchText=ParameterExtractor.ExtractString(queryParameters,SearchTextKey,SearchTextDefault);
            if (userInputSearchText != SearchTextDefault)
            {
                list = list.Where(advertisement =>

                    advertisement.AdTitle.Contains(userInputSearchText) ||
                    advertisement.AdComments.Contains(userInputSearchText));
            }
            return list;
        }

        private IQueryable<Advertisement> includePrice(IQueryable<Advertisement> list, Dictionary<string, string> queryParameters)
        {
            PriceType priceType = ParameterExtractor.ExtractPriceType(queryParameters, PriceTypeKey, PriceTypeDefault);
            if (priceType != PriceTypeDefault)
                list = list.Where(advertisement => advertisement.PriceType == priceType);
            switch (priceType)
            {
                case PriceType.Fixed:
                    list = list.Include(advertisement => advertisement.FixedPrice);

                    //MinPrice and MAxPrice
                    decimal minPrice = ParameterExtractor.ExtractDecimal(queryParameters, MinPriceKey, MinPriceDefault);
                    if (minPrice < MinPriceDefault)
                        minPrice = MinPriceDefault;
                    if (minPrice != MinPriceDefault)
                        list = list.Where(advertisement => advertisement.FixedPrice.PriceAmount > minPrice);

                    decimal maxPrice = ParameterExtractor.ExtractDecimal(queryParameters, MaxPriceKey, MaxPriceDefault);
                    if (maxPrice > MaxPriceDefault)
                        maxPrice = MaxPriceDefault;
                    if (maxPrice != MaxPriceDefault)
                        list = list.Where(advertisement => advertisement.FixedPrice.PriceAmount < maxPrice);


                    break;
                case PriceType.Agreement:
                    list = list.Include(advertisement => advertisement.AgreementPrice);
                    break;
                case PriceType.Exchange:
                    list = list.Include(advertisement => advertisement.ExchangePrice);
                    break;
                case PriceType.Installment:
                    list = list.Include(advertisement => advertisement.InsatllmentPrice);
                    break;
                case PriceType.MortgageAndRent:
                    list = list.Include(advertisement => advertisement.MortgageAndRentPrice);
                    break;
                case PriceType.All:
                    list = list.Include(advertisement => advertisement.FixedPrice)
                        .Include(advertisement => advertisement.AgreementPrice)
                        .Include(advertisement => advertisement.ExchangePrice)
                        .Include(advertisement => advertisement.InsatllmentPrice)
                        .Include(advertisement => advertisement.MortgageAndRentPrice);
                    break;
            }

           
            
            return list;
        }

        private IQueryable<Advertisement> whereClauseAdType(IQueryable<Advertisement> list, Dictionary<string, string> queryParameters)
        {
            AdType userSelectedAdType;
            try
            {
                userSelectedAdType = (AdType)Enum.Parse(typeof(AdType), ParameterExtractor.ExtractInt
                    (queryParameters, Advertisement.AdTypeKey, Advertisement.AdTypeDefauly).ToString());
            }
            catch (Exception ex)
            {
                userSelectedAdType = AdType.All;
            }

            if (userSelectedAdType != AdType.All)
            {
                list = list.Where(advertisement => advertisement.AdType == userSelectedAdType);
            }
            return list;
        }


        //TODO maybe it is a method of Advertisements class
        public Advertisement GetAdvertisementsFromUserInputDictionary(Dictionary<string, string> userInputDictionary)
        {
            Advertisement ad = new Advertisement();
            ad.CategoryId = ParameterExtractor.ExtractInt(userInputDictionary, Category.CategoryIdKey, Category.CategoryIdDefault);
            ad.DistrictId = ParameterExtractor.ExtractInt(userInputDictionary, DistrictIdKey, SingleDistrctIdDefault);
            ad.AdTitle = ParameterExtractor.ExtractString(userInputDictionary, AdTitleKey, AddTitleDefault);
            ad.AdComments = ParameterExtractor.ExtractString(userInputDictionary, AdCommentKey, AdCommentDefault);
            ad.AdLink = "ToBeSet";

            return ad;
        }

        public async Task Add(Dictionary<string, string> userInputDictionary, string userId)
        {
            throw new Exception("خطا. امکان ایجاد آگهی جدید بدوه گروه وجود ندارد");
        }

        public AdvertisementCommon GetAdDetail(Guid adGuid)
        {
            return FindBy(adGuid);
        }

        public async Task AddLetMeKnow(Dictionary<string, string> userInputDictionary, string userId)
        {
            throw new Exception("خطا. امکان ایجاد به من اطلاع بده بدون گروه وجود ندارد");
        }

        public bool CriteriaMatch(ApprovedAd approvedAd, LetMeKnow letMeKnow)
        {
            throw new NotImplementedException("AdCommonRepository/CriteriaMatch");
        }

        public LetMeKnow GetLetMeKnowFormUserInput(Dictionary<string, string> userInputDictionary, string userId)
        {
            LetMeKnow tempLetMeKnow = new LetMeKnow
            {
                UserId = userId,
                CategoryId =
                    ParameterExtractor.ExtractInt(userInputDictionary, Category.CategoryIdKey,Category.CategoryIdDefault),
                EmailOrSms = (EmailOrSms) Enum.Parse(typeof(EmailOrSms),
                    ParameterExtractor.ExtractInt(userInputDictionary, EmailOrSmsKey, EmailOrSmsDefault).ToString()),
                RequetsPrivilege = RequetsPrivilege.Normal,
                RequestInsertDateTime = DateTime.Now
            };
            
            return tempLetMeKnow;
        }

        public async Task<IEnumerable<AdvertisementCommon>> GetUserAdvertisements(string userId)
        {
            List<Advertisement> userAdvertisements = await _adDbContext.Advertisements
                .Where(advertisements => advertisements.UserId == userId).ToListAsync();
            List<AdvertisementCommon> userAdvertisementCommons = new List<AdvertisementCommon>();
            foreach (Advertisement advertisement in userAdvertisements)
            {
                AdvertisementCommon tempAdCommon = new AdvertisementCommon();
                Convertor.FillAdvertisementCommonFromAdvertisement(tempAdCommon, advertisement, _appIdentityDbContext);
                userAdvertisementCommons.Add(tempAdCommon);
            }

            return userAdvertisementCommons;
        }

        public async Task UpdateAd(Guid adGuid, string userId)
        {
            Advertisement updatingAD = _adDbContext.Advertisements.FirstOrDefault(advertisements =>
                 advertisements.AdId == adGuid && advertisements.UserId == userId);
            if (updatingAD != null)
                updatingAD.AdInsertDateTime = DateTime.Now;
            await _adDbContext.SaveChangesAsync();

            return;
        }

        public async Task DeleteAd(Guid adGuid, string userId)
        {
            Advertisement deletingAD = _adDbContext.Advertisements.FirstOrDefault(advertisements =>
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
                letMeKnow.Id == letMeKnowId && letMeKnow.UserId == userId);
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
                        ResponseBase repositoryResponse = new ResponseBase();// = fillAdvertisementCommonFromDataReader(tempAdvertisementCommon, sqlDataReader);
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
            IQueryable<Advertisement> list = _adDbContext.Advertisements
                .Include(advertisement => advertisement.Category)
                .Include(advertisement => advertisement.District)
                .Include(advertisement => advertisement.District.City)
                .Include(advertisement => advertisement.District.City.Province)
                .Include(advertisement => advertisement.AdPrivilege)
                .Include(advertisement => advertisement.AdStatus)
                .Include(advertisement => advertisement.FixedPrice)
                .Where(advertisement => advertisement.AdStatus == AdStatus.Approved && advertisement.AdId == adId);//only accepted ads

            Advertisement item = list.FirstOrDefault();
            AdvertisementCommon adCommon = new AdvertisementCommon();
            Convertor.FillAdvertisementCommonFromAdvertisement(adCommon, item, _appIdentityDbContext);
            return adCommon;
        }

        public async Task IncrementNumberOfVisit(Guid adGuid)
        {
            //TODO error handling use a server log 
            _adDbContext.Advertisements.FirstOrDefault(advertisements => advertisements.AdId == adGuid).AdNumberOfVisited++;
            _adDbContext.SaveChanges();
        }

        //TODO the method implementation is not complete
        public Advertisement GetAdvertisement(AdvertisementCommon advertisementCommon)
        {
            Advertisement ad = new Advertisement();
            ad.AdComments = advertisementCommon.AdComments;
            ad.AdId = advertisementCommon.AdId;
            ad.AdInsertDateTime = advertisementCommon.AdTime;
            ad.AdNumberOfVisited = advertisementCommon.NumberOfVisit;

            return ad;
        }

        private IQueryable<Advertisement> orderByClause(IQueryable<Advertisement> list, Dictionary<string, string> queryParameters)
        {
            OrderBy orderByUserInput = ParameterExtractor.ExtractOrderBy(queryParameters, OrderByKey, OrderByDefault);
            switch (orderByUserInput)
            {
                case OrderBy.PriceAsc:
                    return list.OrderBy(advertisement => advertisement.FixedPrice.PriceAmount);
                case OrderBy.PriceDesc:
                    return list.OrderByDescending(advertisements => advertisements.FixedPrice.PriceAmount);
                case OrderBy.DateAsc:
                    return list.OrderBy(advertisements => advertisements.AdInsertDateTime);
                case OrderBy.DateDesc:
                    return list.OrderByDescending(advertisements => advertisements.AdInsertDateTime);
                default:
                    return list;
            }
        }
        private IQueryable<Advertisement> wherClauseCategoryId(IQueryable<Advertisement> list, Dictionary<string, string> queryParameters)
        {
            int firstLevelCategoryId = ParameterExtractor.ExtractInt(queryParameters, Category.CategoryIdKey, Category.CategoryIdDefault);
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
        
        private IQueryable<Advertisement> whereClauseDistrictId(IQueryable<Advertisement> list, Dictionary<string, string> queryParameters)
        {
            List<int> districtList = ParameterExtractor.ExtractDistrictIds(queryParameters, DistrictIdKey, ListDistrctIdDefault);
            if (districtList.Count > 0)
                list = list.Where(advertisement => districtList.Contains(advertisement.DistrictId));
            return list;
        }



    }
}
