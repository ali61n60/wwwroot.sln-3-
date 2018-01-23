using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;
using MvcMain.Controllers;

namespace MvcMain.Components.Default.Category
{
    public class CategorySelectionViewComponent : ViewComponent
    {
        private readonly CategoryApiController _categoryApi;
        public CategorySelectionViewComponent(CategoryApiController categoryApi)
        {
            _categoryApi = categoryApi;
        }
        public IViewComponentResult Invoke()
        {
            ResponseBase<IEnumerable<ModelStd.Db.Ad.Category>> response = _categoryApi.GetAllCategories();
            if (!response.Success)
                return View("ComponentError", response.Message + ", " + response.ErrorCode);

            return View(response.ResponseData);
        }
    }
}
