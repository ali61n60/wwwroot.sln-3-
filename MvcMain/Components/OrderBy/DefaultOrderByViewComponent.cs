using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;

namespace MvcMain.Components.OrderBy
{
    public class DefaultOrderByViewComponent:ViewComponent
    {
        public IViewComponentResult Invoke()
        {
           return View();
        }
    }
}
