using System.Threading.Tasks;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface ICategoryApi
    {
        Task<ResponseBase<int>> GetServerDataVersion();
        Task<ResponseBase<Category[]>> GetAllCategories();
    }
}