using System;
using System.Collections.Generic;
using System.IO;
using System.Json;
using System.Net;
using System.Threading.Tasks;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Advertisements.Location;
using ModelStd.Services;
using Newtonsoft.Json;
using ServiceLayer;

namespace ChiKoja.Services.Server
{
    public class LocationApi:ILocationApi
    {
        public async Task<ResponseBase<int>> GetLocationyVersion()
        {
            ResponseBase<int> response;
            try
            {
                string url = ServicesCommon.ServerUrl + "/api/LocationApi/GetLocationyVersion";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(url));
                request.ContentType = "application/json";
                request.Method = "POST";
               
                using (WebResponse webResponse = await request.GetResponseAsync())
                {
                    using (Stream stream = webResponse.GetResponseStream())
                    {
                        JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
                        response = JsonConvert.DeserializeObject<ResponseBase<int>>(jsonDoc.ToString());

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
                response = new ResponseBase<int>
                {
                    Success = false,
                    Message = ex.Message
                };
                return response;
            }
        }

        

        public ResponseBase<Province[]> GetAllProvinces()
        {
            throw new NotImplementedException();
        }

        public ResponseBase<District[]> GetAllDistricts()
        {
            throw new NotImplementedException();
        }

        public ResponseBase<City[]> GetAllCities()
        {
            throw new NotImplementedException();
        }
    }
}