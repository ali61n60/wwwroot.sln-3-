using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.SearchAd.AdTransformation
{
    public class SearchCriteriaTransformation : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
