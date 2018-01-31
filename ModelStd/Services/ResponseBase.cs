using System.Collections.Generic;

namespace ModelStd.Services
{
    public class ResponseBase<T>
    {
        private readonly string RequestIndexKey = "RequestIndex";
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

        public void SetSuccessResponse(string message, Dictionary<string,string> userInput)
        {
            Success = true;
            Message = message;
            setRequestIndex(userInput);
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
        public void SetFailureResponse(string message, string errorCode, Dictionary<string, string> userInput)
        {
            Success = false;
            Message = message;
            ErrorCode = errorCode;
            setRequestIndex(userInput);
        }

        public ResponseBase GetSimpleResponseBase()
        {
            ResponseBase responseBase = new ResponseBase();
            responseBase.Success = Success;
            responseBase.Message = Message;
            responseBase.ErrorCode = ErrorCode;
            return responseBase;
        }

        private void setRequestIndex(Dictionary<string, string> userInput)
        {
            if (userInput.ContainsKey(RequestIndexKey))
            {
                if (CustomDictionary != null)
                    CustomDictionary[RequestIndexKey] = userInput[RequestIndexKey];
                else
                    CustomDictionary = new Dictionary<string, string> { { RequestIndexKey, userInput[RequestIndexKey] } };
            }
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
