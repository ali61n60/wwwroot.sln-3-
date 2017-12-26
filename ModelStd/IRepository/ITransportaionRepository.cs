using System.Collections.Generic;
using ModelStd.Advertisements.Transportation;
using ModelStd.Db.Ad;

namespace ModelStd.IRepository
{
    public interface ITransportaionRepository
    {
        Vehicle[] GetAllVehicles();
        IEnumerable<Brand> GetAllBrands();
        IEnumerable<CarModel> GetAllModels();
    }
}
