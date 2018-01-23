using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.AdTransformation
{
    public class SearchCriteriaTransformation : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
