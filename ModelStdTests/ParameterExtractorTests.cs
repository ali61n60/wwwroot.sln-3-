using System;
using System.Collections.Generic;
using ModelStd;
using NUnit.Framework;

namespace RepositoryStdTests
{
    [TestFixture]
    public class ParameterExtractorTests
    {

        [Test]
        public void GetCategoryIdTest()
        {
            Dictionary<string,string> inputDictionary=new Dictionary<string, string>();
            inputDictionary[ParameterExtractor.CategoryIdKey] = "Hello";

            int categoryId = ParameterExtractor.ExtractCatgoryId(inputDictionary);
            Assert.That(categoryId,Is.EqualTo(ParameterExtractor.CategoryIdDefault));
        }
    }
}
