using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;
using MvcMain.Controllers;

namespace MvcMain.Components
{
    public class LocationViewComponent : ViewComponent
    {
        private readonly LocationApiController _locationApiController;

        public LocationViewComponent(LocationApiController locationApiController)
        {
            _locationApiController = locationApiController;
        }

        public IViewComponentResult Invoke()
        {
            ResponseBase<IEnumerable<ModelStd.Advertisements.Category>> response = _locationApiController. _categoryApi.GetAllCategories();
            if (!response.Success)
                return View("ComponentError", response.Message + ", " + response.ErrorCode);

            return View(response.ResponseData);
        }
    }
}
