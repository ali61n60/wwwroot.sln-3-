using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using RepositoryStd.TepmeratureRepository;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MvcMain.Controllers
{
    public class TemperatureController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            //TODO get temp data from database and send data to view
            TemperatureRepository temperatureRepository=new TemperatureRepository();
            return View(temperatureRepository.GetAllTemperatures());
        }
    }
}
