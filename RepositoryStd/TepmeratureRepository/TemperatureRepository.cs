using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ModelStd.Db.Ad;
using RepositoryStd.Context.AD;

namespace RepositoryStd.TepmeratureRepository
{
    public class TemperatureRepository
    {
        private readonly AdDbContext _adDbContext;
        public TemperatureRepository(AdDbContext adDbContext)
        {
            _adDbContext = adDbContext;
        }
        public void Insert(TemperatureModel temperature)
        {
            _adDbContext.TemperatueModels.Add(temperature);
            _adDbContext.SaveChanges();
        }

        public List<TemperatureModel> GetAllTemperatures()
        {
            return _adDbContext.TemperatueModels.ToList();
        }

        public List<TemperatureModel> GetNLastTemperatures(int n)
        {
            int numberOfItems= _adDbContext.TemperatueModels.Count(model => true);
            return _adDbContext.TemperatueModels.Skip(Math.Max(0, numberOfItems - n)).ToList();
        }
    }
}
