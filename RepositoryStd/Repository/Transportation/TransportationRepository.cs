using System.Collections.Generic;
using System.Linq;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using RepositoryStd.Context.AD;

namespace RepositoryStd.Repository.Transportation
{
    //TODO merge this class into AdvertisementTransportationRepository
    public class TransportationRepository : ITransportaionRepository
    {
        private readonly AdDbContext _adDbContext;
        public TransportationRepository(AdDbContext adDbContext)
        {
            _adDbContext = adDbContext;
        }

        public IEnumerable<Brand> GetAllBrands()
        {
            List<Brand> allBrands =new List<Brand>();
            var brands=_adDbContext.Brands.ToList();
            foreach (Brand brand in brands)
            {
                allBrands.Add(brand);
            }

            return allBrands;
        }

      
        public IEnumerable<CarModel> GetAllModels()
        {
            List<CarModel> allCarModels =new List<CarModel>();
            var carModels=_adDbContext.CarModels.ToList();
            foreach (CarModel carModel in carModels)
            {
                allCarModels.Add(carModel);
            }

            return allCarModels;
        }
    }
}
