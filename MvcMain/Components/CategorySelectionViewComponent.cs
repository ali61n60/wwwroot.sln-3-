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
    public class CategorySelectionViewComponent: ViewComponent
    {
        private CategoryApiController _categoryApi;
        public CategorySelectionViewComponent(CategoryApiController categoryApi)
        {
            _categoryApi = categoryApi;
        }
        public IViewComponentResult Invoke()
        {
            //TODO Get All categories and pass it to the view to show to user
            ResponseBase<Category[]> response= _categoryApi.GetAllCategories();
            if (!response.Success)
            {
                //TODD Search what to do in case of error in View Component
            }
            return View(response.ResponseData);
        }
    }
}
