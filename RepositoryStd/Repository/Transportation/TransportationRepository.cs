using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
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
            List<Brand> allBrands = _adDbContext.Brands.AsNoTracking().ToList();
            foreach (Brand brand in allBrands)
            {
                brand.CarModels = null;
                brand.LetMeKnowAttributeTransportaion = null;
            }

            return allBrands;
        }

      
        public IEnumerable<CarModel> GetAllModels()
        {
            List<CarModel> allCarModels = _adDbContext.CarModels.AsNoTracking().ToList();
            foreach (CarModel carModel in allCarModels)
            {
                carModel.LetMeKnowAttributeTransportaion = null;
                carModel.AdAttributeTransportations = null;
                carModel.Brand = null;
            }

            return allCarModels;
        }
    }
}
