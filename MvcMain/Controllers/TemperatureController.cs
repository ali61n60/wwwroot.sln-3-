using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using RepositoryStd.Context.AD;
using RepositoryStd.TepmeratureRepository;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//https://canvasjs.com/
//TODO make updates by ajax
namespace MvcMain.Controllers
{
    public class TemperatureController : Controller
    {
        private readonly AdDbContext _adDbContext;
        private readonly int _initialNumberOfItems = 2;

        public TemperatureController(AdDbContext adDbContext)
        {
            _adDbContext = adDbContext;
        }
       
        public IActionResult Index()
        {
            
            TemperatureRepository temperatureRepository=new TemperatureRepository(_adDbContext);

            return View(temperatureRepository.GetNLastTemperatures(_initialNumberOfItems));
        }

        public IActionResult CustomResult(int numberOfItems)
        {
            //TODO get temp data from database and send data to view
            TemperatureRepository temperatureRepository = new TemperatureRepository(_adDbContext);
            return View("Index",temperatureRepository.GetNLastTemperatures(numberOfItems));
        }

    }
}
