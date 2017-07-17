using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using Repository.QueryPattern.BaseQuery;
using Repository.QueryPattern.SearchField;

namespace Repository.QueryPattern.BaseQueryTest
{
    [TestFixture]
    class SearchFieldTest
    {
        Dictionary<string, string> _dictionary;

        [SetUp]
        public void Setup()
        {
            _dictionary = new Dictionary<string, string>();
        }

        [Test]
        public void IntegerSearchFieldTest() 
        {
            //Normal
            _dictionary.Add("CategoryId", "100");
            SearchFieldInteger _searchField = new SearchFieldInteger("CategoryId", "NotApplicable",CriteriaOperator.Equal, -100, 150, 0, _dictionary);
            Assert.That(_searchField.Value, Is.EqualTo(100));

            //Greater than max value
            _dictionary["CategoryId"] = "1500";
            _searchField = new SearchFieldInteger("CategoryId", "NotApplicable",CriteriaOperator.Equal, -100, 150, 0, _dictionary);
            Assert.That(_searchField.Value, Is.EqualTo(_searchField.DefaultValue));

            //Invalid value
            _dictionary["CategoryId"] = "Hello";
            _searchField = new SearchFieldInteger("CategoryId", "NotApplicable",CriteriaOperator.Equal, 0, 150, 0, _dictionary);
             Assert.That(_searchField.Value,Is.EqualTo(_searchField.DefaultValue));
        }

        [Test]
        public void DecimalSearchFieldTest()
        {
            //Normal
            _dictionary.Add("MinimumPrice", "1000");
            SearchFieldDecimal _searchField = new SearchFieldDecimal("MinimumPrice", "Price",CriteriaOperator.LessThanOrEqual, 0, decimal.MaxValue, 0, _dictionary);
            Assert.That(_searchField.Value, Is.EqualTo(1000));

            //Less than min value
            _dictionary["MinimumPrice"]= "-1000";
            _searchField = new SearchFieldDecimal("MinimumPrice", "Price",CriteriaOperator.LessThanOrEqual, 0, decimal.MaxValue, 0, _dictionary);
            Assert.That(_searchField.Value, Is.EqualTo(_searchField.DefaultValue));

            //Invalid value
            _dictionary["MinimumPrice"] = "Hello";
            _searchField = new SearchFieldDecimal("MinimumPrice", "Price",CriteriaOperator.LessThanOrEqual, 0, int.MaxValue, 0, _dictionary);
            Assert.That(_searchField.Value, Is.EqualTo(_searchField.DefaultValue));
        }

        [Test]
        public void BooleanSearchFieldTest()
        {
            //Normal
            _dictionary.Add("OnlyWithPictures", "true");
             SearchFieldBool _searchField = new SearchFieldBool("OnlyWithPictures","NotApplicabaleYet",false,_dictionary);
             Assert.That(_searchField.Value,Is.EqualTo(true));

            //Invalid input
            _dictionary["OnlyWithPictures"] = "Hello";
            _searchField = new SearchFieldBool("OnlyWithPictures", "NotApplicabaleYet", false, _dictionary);
            Assert.That(_searchField.Value, Is.EqualTo(_searchField.DefaultValue));
        }

        [Test]
        public void StringSearchFieldTest()
        {
            //Normal
            _dictionary.Add("City","Tehran");
            SearchFieldString _searchField=new SearchFieldString("City","City.CityName",CriteriaOperator.Equal, "",_dictionary);
            Assert.That(_searchField.Value,Is.EqualTo("Tehran"));
        }

    }
}
