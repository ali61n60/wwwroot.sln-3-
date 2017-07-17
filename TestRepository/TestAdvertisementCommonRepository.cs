using NUnit.Framework;
using Repository.Repository;

namespace TestRepository
{
    [TestFixture]
    public class TestAdvertisementCommonRepository
    {
        AdvertisementCommonRepository _advertisementCommonRepository;
        string _connectionString = "Data Source= .\\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801";
        [SetUp]
        public void Setup()
        {
            _advertisementCommonRepository=new AdvertisementCommonRepository(_connectionString);
        }

        [Test]
        public void testTest()
        {
            
        }
    }
}
