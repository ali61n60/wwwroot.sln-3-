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
        public void Insert(TemperatureModel temperature)
        {
            AdDbContext adDbContext = new AdDbContext();
            adDbContext.TemperatueModels.Add(temperature);
            adDbContext.SaveChanges();
        }

        public List<TemperatureModel> GetAllTemperatures()
        {
            AdDbContext adDbContext = new AdDbContext();
            return adDbContext.TemperatueModels.ToList();
        }
    }
}
