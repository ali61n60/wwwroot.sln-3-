using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.Default
{
    public class FileUploadViewComponent: ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
