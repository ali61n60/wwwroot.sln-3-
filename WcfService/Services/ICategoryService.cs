using System.ServiceModel;
using Model.Advertisements;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceContract]
    public interface ICategoryService:IServiceCommon
    {
        [OperationContract]
        ResponseBase<Category[]> GetAllCategories();

        [OperationContract]
        ResponseBase<Category[]> GetChildrenCategories(int categoryId);

        [OperationContract]
        ResponseBase<Category> GetParentCategory(int categoryId);

        ResponseBase<Category> GetRootParentCategory(int categoryId);
        
    }
}
