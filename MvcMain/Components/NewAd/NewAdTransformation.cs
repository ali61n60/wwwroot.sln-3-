using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.NewAd
{
    public class NewAdTransformation : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
