using System;
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
        //public static string ServerUrl = "http://192.168.42.76";//Work
        //public static string ServerUrl = "http://10.71.34.1";//Internal
        public static string ServerUrl = "http://192.168.43.19";//Home

        public static async Task<ResponseBase<T>> CallService<T>(string controllerActionUrlPart)
        {
            return await CallService<T>(controllerActionUrlPart, null);
        }

        public static async Task<ResponseBase<T>> CallService<T>(string controllerActionUrlPart,object userInput)
        {
            ResponseBase<T> response;

            try
            {
                string url = ServerUrl + "/" + controllerActionUrlPart;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));
                request.ContentType = "application/json";
                request.Method = "POST";
                if (userInput == null)
                    userInput = true;
                
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
                        string jsonDocString = jsonDoc.ToString();
                        response = JsonConvert.DeserializeObject<ResponseBase<T>>(jsonDocString, new Newtonsoft.Json.JsonSerializerSettings
                        {
                            TypeNameHandling = Newtonsoft.Json.TypeNameHandling.Auto,
                            NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore
                             
                        });

                        if (!response.Success)
                        {
                            throw new Exception(response.Message + " ErrorCode=" + response.ErrorCode);
                        }
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
                
            }
            return response;
        }
    }
}