using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.Default
{
    public class UserSingleLetMeKnowItemViewComponent:ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(ModelStd.Db.Ad.LetMeKnow letMeKnow)
        {
            return View(letMeKnow);
        }
    }
}
