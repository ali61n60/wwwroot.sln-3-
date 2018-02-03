using System.Threading.Tasks;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Services;

namespace ChiKoja.Services.Server
{
    public class RepositoryApi: IRepositoryApi
    {
        public async Task<ResponseBase<int>> GetServerMainDataVersion()
        {
            return await ServicesCommon.CallService<int>("api/RepositoryApi/GetServerMainDataVersion");
        }
    }
}