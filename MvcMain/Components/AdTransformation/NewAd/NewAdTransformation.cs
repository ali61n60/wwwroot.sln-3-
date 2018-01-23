using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.AdTransformation.NewAd
{
    public class NewAdTransformation : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
