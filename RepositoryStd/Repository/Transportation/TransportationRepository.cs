﻿using System.Collections.Generic;
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
            List<Brand> allBrands = _adDbContext.Brands.ToList();
            return allBrands;
        }

        //TODO use EF
        public IEnumerable<CarModel> GetAllModels()
        {
            List<CarModel> allCarModels = _adDbContext.CarModels.ToList();
            return allCarModels;
        }
    }
}
