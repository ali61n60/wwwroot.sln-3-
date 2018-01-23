using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.Default.NewAd
{
    public class NewAdDefault : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
