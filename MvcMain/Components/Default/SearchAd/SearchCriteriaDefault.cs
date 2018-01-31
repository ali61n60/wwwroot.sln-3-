using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Components.Default.SearchAd
{
    public class SearchCriteriaDefault : ViewComponent
    {
        public string Invoke()
        {
            // View("Default", "Hllo World");

            return "hello";
        }
    }
}
