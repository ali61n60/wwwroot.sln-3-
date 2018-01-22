using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;

namespace MvcMain.Components.Default
{
    public class UserSingleAdItemViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(AdvertisementCommon advertisementCommon)
        {
            return View(advertisementCommon);
        }
    }
}



