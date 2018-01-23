using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.Default.LetMeKnow
{
    public class LetMeKnowDefault : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
