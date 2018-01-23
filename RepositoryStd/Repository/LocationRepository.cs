using System.Collections.Generic;
using System.Linq;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using RepositoryStd.Context.AD;

namespace RepositoryStd.Repository
{
    public class LocationRepository:ILocationRepository
    {
        private AdDbContext _adDbContext;
        public LocationRepository(AdDbContext adDbContext)
        {
            _adDbContext = adDbContext;
        }
        public IEnumerable<Province> GetAllProvinces()
        {
            return _adDbContext.Provinces.ToList();
        }

        public IEnumerable<City> GetAllCities()
        {
            return _adDbContext.Cities.ToList();
        }

        public IEnumerable<District> GetAllDistricts()
        {
            return _adDbContext.Districts.ToList();
        }
    }
}
