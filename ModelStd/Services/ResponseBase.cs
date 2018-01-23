using System.Collections.Generic;

namespace ModelStd.Services
{
    public class ResponseBase<T>
    {
        public T ResponseData;

        public bool Success { get; set; }

        public string Message { get; set; }

        public string ErrorCode { get; set; }

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
            ResponseBase responseBase = new ResponseBase();
            responseBase.Success = Success;
            responseBase.Message = Message;
            responseBase.ErrorCode = ErrorCode;
            return responseBase;
        }
    }

    public class ResponseBase
    {
        public bool Success { get; set; }

        public string Message { get; set; }


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
