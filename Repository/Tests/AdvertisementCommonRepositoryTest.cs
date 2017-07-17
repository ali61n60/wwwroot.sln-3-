using NUnit.Framework;
using Repository.Repository;

namespace Repository.Tests
{
    [TestFixture]
    class AdvertisementCommonRepositoryTest
    {
        AdvertisementCommonRepository _AdvertisementCommonRepository;
        string _connectionString = 
            "Data Source= .\\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801";

        [SetUp]
        public void Setup()
        {
            _AdvertisementCommonRepository=new AdvertisementCommonRepository(_connectionString);
        }

        [Test]
        public void test1()
        {
            
        }
    }
}
