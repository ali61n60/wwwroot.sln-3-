using System.Threading.Tasks;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.Services.Server
{
    class CategoryApi:ICategoryApi
    {
        public async Task<ResponseBase<int>> GetServerDataVersion()
        {
            return await ServicesCommon.CallService<int>("api/CategoryApi/GetServerDataVersion");
        }

        public async Task<ResponseBase<Category[]>> GetAllCategories()
        {
            return await ServicesCommon.CallService<Category[]>("api/CategoryApi/GetAllCategories");
        }
    }
}