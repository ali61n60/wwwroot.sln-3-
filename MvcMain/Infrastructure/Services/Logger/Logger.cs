using System;
using System.IO;
using System.Threading.Tasks;


namespace MvcMain.Infrastructure.Services.Logger
{
    public class Logger : ILogger
    {
        private string DirectoryPath;
        private string ErrorFileName = "ErrorLog.txt";

        public Logger(string directoryPath)
        {
            DirectoryPath = directoryPath;
        }

        public void LogDebug(string data)
        {
            throw new NotImplementedException();
        }

        public void LogVerbose(string data)
        {
            throw new NotImplementedException();
        }

        public void LogInformation(string data)
        {
            throw new NotImplementedException();
        }

        public void LogMinimal(string data)
        {
            throw new NotImplementedException();
        }

        public void LogWarning(string data)
        {
            throw new NotImplementedException();
        }

        public async Task LogError(string data)
        {
            await Task.Run(() =>
            {
                string errorFile = DirectoryPath + ErrorFileName;
                try
                {
                    using (Stream errorStream = !File.Exists(errorFile) ? File.Create(errorFile) : File.Open(errorFile, FileMode.Append))
                    {
                        using (StreamWriter streamWriter = new StreamWriter(errorStream))
                        {
                            streamWriter.WriteLine(data + " " + DateTime.Now);
                            streamWriter.Flush();
                        }
                    }
                }
                catch (Exception ex)
                {
                    //TODO what todo when error in LogError
                }
            });
        }

        public void LogInformationSummary(string data)
        {
            throw new NotImplementedException();
        }

        public void LogErrorSummary(string data)
        {
            throw new NotImplementedException();
        }
    }
}
