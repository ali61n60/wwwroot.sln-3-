using System;
using System.Collections.Generic;
using System.IO;
using System.Json;
using System.Net;
using System.Threading.Tasks;
using ModelStd.Services;
using Newtonsoft.Json;

namespace ChiKoja.Services.Server
{
    public class ServicesCommon
    {
        public static string ServerUrl = "http://192.168.42.76";

        public static async Task<ResponseBase<T>> CallService<T>(string controllerActionUrlPart)
        {
            ResponseBase<T> response;
            
            try
            {
                string url = ServerUrl + "/" + controllerActionUrlPart;
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(url));
                request.ContentType = "application/json";
                request.Method = "GET";

                using (WebResponse webResponse = await request.GetResponseAsync())
                {
                    using (Stream stream = webResponse.GetResponseStream())
                    {
                        JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
                        response = JsonConvert.DeserializeObject<ResponseBase<T>>(jsonDoc.ToString());

                        if (response.Success)
                        {
                            return response;
                        }
                        else
                            throw new Exception(response.Message + " ErrorCode=" + response.ErrorCode);
                    }
                }
            }
            catch (Exception ex)
            {
                response = new ResponseBase<T>()
                {
                    Success = false,
                    Message = ex.Message
                };
                return response;
            }
        }
        public static async Task<ResponseBase<T>> CallService<T>(string controllerActionUrlPart,Dictionary<string,string> userInput)
        {
            ResponseBase<T> response;

            try
            {
                string url = ServerUrl + "/" + controllerActionUrlPart;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));
                request.ContentType = "application/json";
                request.Method = "POST";
                using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    string jsonData = JsonConvert.SerializeObject(userInput);
                    streamWriter.Write(jsonData);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                using (WebResponse webResponse = await request.GetResponseAsync())
                {
                    using (Stream stream = webResponse.GetResponseStream())
                    {
                        JsonValue jsonDoc = await Task.Run(() => JsonValue.Load(stream));
                        response = JsonConvert.DeserializeObject<ResponseBase<T>>(jsonDoc.ToString());

                        if (response.Success)
                        {
                            return response;
                        }
                        else
                            throw new Exception(response.Message + " ErrorCode=" + response.ErrorCode);
                    }
                }
            }
            catch (Exception ex)
            {
                response = new ResponseBase<T>
                {
                    Success = false,
                    Message = ex.Message
                };
                return response;
            }
        }
    }
}