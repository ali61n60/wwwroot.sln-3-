using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.Default.SearchAd
{
    public class SearchCriteriaDefault : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
