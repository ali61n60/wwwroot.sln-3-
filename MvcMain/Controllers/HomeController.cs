using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
//using s1;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MvcMain.Controllers
{
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public async Task<IActionResult> Index()
        {
            //Service1Client service1 =
            //    new Service1Client(Service1Client.EndpointConfiguration.BasicHttpBinding_IService1);
            //string hi=await service1.SayHelloAsync();
            
            //service1.CloseAsync();
            //ViewBag.Hi = hi;

            return View();
        }
    }
}
