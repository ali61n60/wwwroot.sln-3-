using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;
using MvcMain.Controllers;

namespace MvcMain.Components.Category.SearchAd
{
    public class CategorySelectionViewComponent: ViewComponent
    {
        private readonly CategoryApiController _categoryApi;
        public CategorySelectionViewComponent(CategoryApiController categoryApi)
        {
            _categoryApi = categoryApi;
        }
        public IViewComponentResult Invoke()
        {
            //TODO Get All categories and pass it to the view to show to user
            ResponseBase<IEnumerable<ModelStd.Advertisements.Category>> response= _categoryApi.GetAllCategories();
            if (!response.Success)
            {
                //TODD Search what to do in case of error in View Component
            }
            return View(response.ResponseData);
        }
    }
}
