using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components
{
    public class BrandsTransformationViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            //TODO get all brands from database and pass it to view to render
            return View();
        }
    }
}
