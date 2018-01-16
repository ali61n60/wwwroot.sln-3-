using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components
{
    public class UserSingleAdItem:ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(Guid adGuid)
        {
            return View(adGuid);
        }
    }
}
