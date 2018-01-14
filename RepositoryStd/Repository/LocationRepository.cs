using System;
using System.Collections.Generic;
using System.Text;
using ModelStd.Db.Ad;
using ModelStd.IRepository;

namespace RepositoryStd.Repository
{
    public class LocationRepository:ILocationRepository
    {
        public IEnumerable<Province> GetAllProvinces()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<City> GetAllCities()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<District> GetAllDistricts()
        {
            throw new NotImplementedException();
        }
    }
}
