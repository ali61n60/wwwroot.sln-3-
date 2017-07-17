using System.Collections.Generic;
using System.Runtime.Serialization;

namespace WcfService.Messages
{
    [DataContract]
    public  class ResponseBase<T>
    {
        [DataMember]
        public T ResponseData;
        [DataMember]
        public bool Success { get; set; }
        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public string ErrorCode { get; set; }

        [DataMember]
        public Dictionary<string, string> CustomDictionary { get; set; } 

        public void SetSuccessResponse()
        {
            SetSuccessResponse("OK");
        }

        public void SetSuccessResponse(string message)
        {
            Success = true;
            Message = message;
        }

        public void SetFailureResponse(string message)
        {
            Success = false;
            Message = message;
        }

        public void SetFailureResponse(string message, string errorCode)
        {
            Success = false;
            Message = message;
            ErrorCode = errorCode;
        }

        public ResponseBase GetSimpleResponseBase()
        {
            ResponseBase responseBase=new ResponseBase();
            responseBase.Success = this.Success;
            responseBase.Message = this.Message;
            responseBase.ErrorCode = this.ErrorCode;
            return responseBase;
        }
    }

    [DataContract]
    public class ResponseBase
    {
        [DataMember]
        public bool Success { get; set; }
        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public string ErrorCode { get; set; }

        public void SetSuccessResponse()
        {
            SetSuccessResponse("OK");
        }

        public void SetSuccessResponse(string message)
        {
            Success = true;
            Message = message;
        }

        public void SetFailureResponse(string message)
        {
            Success = false;
            Message = message;
        }

        public void SetFailureResponse(string message, string errorCode)
        {
            Success = false;
            Message = message;
            ErrorCode = errorCode;
        }
    }

}
