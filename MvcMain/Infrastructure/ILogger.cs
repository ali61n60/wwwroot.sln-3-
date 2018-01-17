using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcMain.Infrastructure
{
    public interface ILogger
    {
        void LogDebug(string data);
        void LogVerbose(string data);
        void LogInformation(string data);
        void LogMinimal(string data);
        void LogWarning(string data);
        Task LogError(string data);
        void LogInformationSummary(string data);
        void LogErrorSummary(string data);
    }
}
