using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;

namespace MvcMain.Components.Default
{
    public class UserSingleLetMeKnowItemViewComponent:ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(LetMeKnow letMeKnow)
        {
            return View(letMeKnow);
        }
    }
}
