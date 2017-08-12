using System.Threading.Tasks;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface IRepositoryApi
    {
        Task<ResponseBase<int>> GetServerMainDataVersion();
    }
}