using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using Model.Advertisements;
using Model.IRepository;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public CategoryService()
            
        {
            
        }

        public ResponseBase<Category[]> GetAllCategories()
        {
            string errorCode = "CategoryService.GatAllCategories";
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

        public ResponseBase<Category[]> GetChildrenCategories(int categoryId)
        {
            string errorCode = "CategoryService.GetChildrenCategories";
            ResponseBase<Category[]> response = new ResponseBase<Category[]>();
            try
            {
                response.ResponseData = _categoryRepository.GetAllChildernCategories(categoryId);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.ResponseData = null;
                response.SetFailureResponse(ex.Message,errorCode);
            }
            return response;
        }

        public ResponseBase<Category> GetParentCategory(int categoryId)
        {
            string errorCode = "CategoryService.GetParentCategory";
            ResponseBase<Category> response = new ResponseBase<Category>();
            try
            {
                response.ResponseData = _categoryRepository.FindParentCategoryById(categoryId);
                if (response.ResponseData != null)
                {
                    response.SetSuccessResponse();
                }
                else
                {
                    response.SetFailureResponse("Could Not Find Parent Category",errorCode);
                }
            }
            catch (Exception ex)
            {
                response.ResponseData = null;
                response.SetFailureResponse(ex.Message, errorCode);
            }
            return response;
        }

        public ResponseBase<Category> GetRootParentCategory(int categoryId)
        {
            string errorCode = "CategoryService.GetRootParentCategory";
            ResponseBase<Category> response = new ResponseBase<Category>();
            try
            {
                response.ResponseData = _categoryRepository.FindRootParentCategoryById(categoryId);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.ResponseData = null;
                response.SetFailureResponse(ex.Message,errorCode);
            }
            return response;
        }
       

        public ResponseBase<int> GetServerDataVersion()
        {
            string errorCode = "CategoryService.GetServerDataVersion";
            ResponseBase<int> response = new ResponseBase<int>();
            response.ResponseData = _categoryRepository.CategoryVersion;
            response.SetSuccessResponse();
            return response;
        }
    }
}
