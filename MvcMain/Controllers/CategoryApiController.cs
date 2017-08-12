using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Advertisements;
using ModelStd.IRepository;
using ModelStd.Services;
using MvcMain.Infrastructure.IOC;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class CategoryApiController:Controller
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryApiController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public CategoryApiController():
            this(AppServiceProvider.Instance.GetService<ICategoryRepository>())
            
        {

        }
        public ResponseBase<int> GetServerDataVersion()
        {
            string errorCode = "CategoryApiController.GetServerDataVersion";
            ResponseBase<int> response = new ResponseBase<int>();
            response.ResponseData = _categoryRepository.CategoryVersion;
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<Category[]> GetAllCategories()
        {
            string errorCode = "CategoryApiController.GatAllCategories";
            ResponseBase<Category[]> response = new ResponseBase<Category[]>();
            try
            {
                response.ResponseData = _categoryRepository.GetAllCategories();
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.ResponseData = null;
                response.SetFailureResponse(ex.Message, errorCode);
            }
            return response;
        }
    }
}
