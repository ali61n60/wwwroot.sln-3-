using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Repository.Messages
{
    public class RepositoryResponseBase
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public  bool ExceptionOcurred { get; set; }
        public string ErrorCode { get; set; }
    }
}
