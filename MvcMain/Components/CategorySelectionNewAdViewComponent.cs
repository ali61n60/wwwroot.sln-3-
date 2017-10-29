using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Services;
using MvcMain.Controllers;

namespace MvcMain.Components
{
    public class CategorySelectionNewAdViewComponent : ViewComponent
    {
        private CategoryApiController _categoryApi;
        public CategorySelectionNewAdViewComponent(CategoryApiController categoryApi)
        {
            _categoryApi = categoryApi;
        }
        public IViewComponentResult Invoke()
        {
            ResponseBase<IEnumerable<Category>> response = _categoryApi.GetAllCategories();
            if (!response.Success)
                return View("ComponentError", response.Message+", "+response.ErrorCode);
            
            return View(response.ResponseData);
        }
    }
}
