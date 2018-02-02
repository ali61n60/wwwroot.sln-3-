using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using ModelStd.Services;

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
        
        public ResponseBase<int> GetServerDataVersion()
        {
            ResponseBase<int> response = new ResponseBase<int>
            { ResponseData = _categoryRepository.CategoryVersion};
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<IEnumerable<Category>> GetAllCategories()
        {
            string errorCode = "CategoryApiController.GetAllCategories";
            ResponseBase<IEnumerable<Category>> response = new ResponseBase<IEnumerable<Category>>();
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
