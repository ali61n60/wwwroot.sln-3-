using System.Collections.Generic;
using Model.IRepository;
using NUnit.Framework;
using Repository.QueryPattern.BaseQuery;

namespace Repository.QueryPattern.BaseQueryTest
{
    [TestFixture]
    class BaseQueryAdCommonTest
    {
        private BaseQueryAdCommon _baseQueryAdCommon;
        private Dictionary<string, string> _userInputDictionary;
        private IQuery _Iquery;
        [SetUp]
        public void Setup()
        {
            _userInputDictionary=new Dictionary<string, string>();
        }

        [Test]
        public void CategoryIdTest()
        {
            _userInputDictionary.Add("CategoryId", "10");
            _baseQueryAdCommon=new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.CategoryId.Value, Is.EqualTo(10));

            _userInputDictionary["CategoryId"] = "-100";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.CategoryId.Value, Is.EqualTo(_baseQueryAdCommon.CategoryId.DefaultValue));

           _userInputDictionary["CategoryId"] = "Hello";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.CategoryId.Value, Is.EqualTo(_baseQueryAdCommon.CategoryId.DefaultValue));

            _userInputDictionary.Remove("CategoryId");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.CategoryId.Value, Is.EqualTo(_baseQueryAdCommon.CategoryId.DefaultValue));
        }

        [Test]
        public void OrderByTest()
        {
            _userInputDictionary.Add("OrderBy", "DateAsc");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OredrBy, Is.EqualTo(OrderBy.DateAsc));

            _userInputDictionary["OrderBy"] = "DateDesc";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OredrBy, Is.EqualTo(OrderBy.DateDesc));

            _userInputDictionary["OrderBy"] = "PriceAsc";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OredrBy, Is.EqualTo(OrderBy.PriceAsc));

            _userInputDictionary["OrderBy"] = "PriceDesc";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OredrBy, Is.EqualTo(OrderBy.PriceDesc));

            _userInputDictionary["OrderBy"] = "HelloWorld";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OredrBy, Is.EqualTo(_baseQueryAdCommon._defaultOrderBy));

            _userInputDictionary.Remove("OrderBy");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OredrBy, Is.EqualTo(_baseQueryAdCommon._defaultOrderBy));
        }

        [Test]
        public void MinimumPriceTest()
        {
            _userInputDictionary.Add("MinimumPrice", "100");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MinimumPrice.Value, Is.EqualTo(100));

           _userInputDictionary["MinimumPrice"] = "-100";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MinimumPrice.Value, Is.EqualTo(_baseQueryAdCommon.MinimumPrice.DefaultValue));

           _userInputDictionary["MinimumPrice"] = "Hello";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MinimumPrice.Value, Is.EqualTo(_baseQueryAdCommon.MinimumPrice.Value));

            _userInputDictionary.Remove("MinimumPrice") ;
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MinimumPrice.Value, Is.EqualTo(_baseQueryAdCommon.MinimumPrice.Value));

        }

        [Test]
        public void MaximumPriceTest()
        {
            _userInputDictionary.Add("MaximumPrice", "10000");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MaximumPrice.Value, Is.EqualTo(10000));

           _userInputDictionary["MaximumPrice"] = "-100";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MaximumPrice.Value, Is.EqualTo(_baseQueryAdCommon.MaximumPrice.DefaultValue));

            _userInputDictionary["MaximumPrice"] = "Hello";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MaximumPrice.Value, Is.EqualTo(_baseQueryAdCommon.MaximumPrice.DefaultValue));

           _userInputDictionary.Remove("MaximumPrice");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.MaximumPrice.Value, Is.EqualTo(_baseQueryAdCommon.MaximumPrice.DefaultValue));
        }

        [Test]
        public void OnlyWithPicturesTest()
        {
            _userInputDictionary.Add("OnlyWithPictures", "true");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OnlyWithPictures.Value, Is.EqualTo(true));

            _userInputDictionary["OnlyWithPictures"] = "false";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OnlyWithPictures.Value, Is.EqualTo(false));

           _userInputDictionary["OnlyWithPictures"] = "How Are You";
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OnlyWithPictures.Value, Is.EqualTo(_baseQueryAdCommon.OnlyWithPictures.DefaultValue));

            _userInputDictionary.Remove("OnlyWithPictures");
            _baseQueryAdCommon = new BaseQueryAdCommon(_userInputDictionary);
            Assert.That(_baseQueryAdCommon.OnlyWithPictures.Value, Is.EqualTo(_baseQueryAdCommon.OnlyWithPictures.DefaultValue));
        }

        [Test]
        public void MinimuPriceQuery()
        {
            string whereClause;
            
            _userInputDictionary.Add("MinimumPrice","100");
            _userInputDictionary.Add("MaximumPrice","2000");
            string expectedWhereClause = " AND "+_baseQueryAdCommon.MinimumPrice.DatabaseColumnName+">= @"+
                _baseQueryAdCommon.MinimumPrice.PropertyName;
            expectedWhereClause += " AND " + _baseQueryAdCommon.MaximumPrice.DatabaseColumnName + "<= @" +
                _baseQueryAdCommon.MaximumPrice.PropertyName;
            _baseQueryAdCommon=new BaseQueryAdCommon(_userInputDictionary);

            whereClause = _baseQueryAdCommon.GetWhereClause();
            Assert.That(whereClause,Is.EqualTo(expectedWhereClause));
        }
    }
}
