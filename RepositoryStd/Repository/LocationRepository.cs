using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
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
            List<Province> allProvinces=new List<Province>();
            IEnumerable<Province> provinces=_adDbContext.Provinces;
            foreach (Province province in provinces)
            {
                allProvinces.Add(province);
            }

            return allProvinces;
        }

        public IEnumerable<City> GetAllCities()
        {
            List<City> allCities=new List<City>();
            IEnumerable<City> cities=_adDbContext.Cities;
            foreach (City city in  cities)
            {
                allCities.Add(city);
            }

            return allCities;
        }

        public IEnumerable<District> GetAllDistricts()
        {

            List<District> allDistricts=new List<District>();
            IEnumerable<District> districts= _adDbContext.Districts;
            foreach (District district in districts)
            {
                allDistricts.Add(district);
            }

            return allDistricts;
        }
    }
}
