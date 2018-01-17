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
        public void Insert(Temperature temperature)
        {
            _adDbContext.Temperatures.Add(temperature);
            _adDbContext.SaveChanges();
        }

        public List<Temperature> GetAllTemperatures()
        {
            return _adDbContext.Temperatures.ToList();
        }

        public List<Temperature> GetNLastTemperatures(int n)
        {
            int numberOfItems= _adDbContext.Temperatures.Count(model => true);
            return _adDbContext.Temperatures.Skip(Math.Max(0, numberOfItems - n)).ToList();
        }
    }
}
