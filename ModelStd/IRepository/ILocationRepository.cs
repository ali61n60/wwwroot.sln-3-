using System.Collections.Generic;
using ModelStd.Db.Ad;

namespace ModelStd.IRepository
{
    public interface ILocationRepository
    {
        IEnumerable<Province> GetAllProvinces();
        IEnumerable<City> GetAllCities();
        IEnumerable<District> GetAllDistricts();
    }
}
