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
            List<Province> allProvinces= _adDbContext.Provinces.ToList();
            foreach (Province province in allProvinces)
            {
                province.Cities = null;
            }

            return allProvinces;
        }

        public IEnumerable<City> GetAllCities()
        {
            List<City> allCities= _adDbContext.Cities.ToList();
            foreach (City city in  allCities)
            {
                city.Province = null;
                city.Districts = null;
            }

            return allCities;
        }

        public IEnumerable<District> GetAllDistricts()
        {
            List<District> allDistricts= _adDbContext.Districts.ToList();
            foreach (District district in allDistricts)
            {
                district.City = null;
                district.Advertisements = null;
            }

            return allDistricts;
        }
    }
}
