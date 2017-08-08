using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public interface ICallBack
    {
        void OnSuccess(int requsetCode); 
        void OnError(int requsetCode,Exception ex);
        void OnProgress(int requsetCode,int progressPercent);
    }
}
