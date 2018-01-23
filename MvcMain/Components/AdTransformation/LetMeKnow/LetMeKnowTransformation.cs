using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.AdTransformation.LetMeKnow
{
    public class LetMeKnowTransformation : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
