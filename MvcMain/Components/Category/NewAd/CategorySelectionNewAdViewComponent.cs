using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;
using MvcMain.Controllers;

namespace MvcMain.Components.Category.NewAD
{
    public class CategorySelectionNewAdViewComponent : ViewComponent
    {
        private readonly CategoryApiController _categoryApi;
        public CategorySelectionNewAdViewComponent(CategoryApiController categoryApi)
        {
            _categoryApi = categoryApi;
        }
        public IViewComponentResult Invoke()
        {
            ResponseBase<IEnumerable<ModelStd.Advertisements.Category>> response = _categoryApi.GetAllCategories();
            if (!response.Success)
                return View("ComponentError", response.Message+", "+response.ErrorCode);
            
            return View(response.ResponseData);
        }
    }
}
