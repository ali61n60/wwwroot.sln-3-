using System;
using System.IO;
using System.Json;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Services;
using ChiKoja.Services.Server;
using ModelStd.Services;
using Newtonsoft.Json;


namespace ChiKoja.Repository.CryptoGraphy
{
    public class CryptoGraphy : ILocalTable
    {
        ISharedPreferences prefs;

        public int OperationOrder { get; private set; }

        private readonly string LocalServerPublicKeyVersionKey = "LocalServerPublicKeyVersionKey";//server public key version stored locally
        private readonly int LocalServerPublicKeyVersionDefault = -1;


        private readonly string LocalServerPublicKeyKey = "LocalServerPublicKeyKey";//server public key stored locally
        private readonly string LocalServerPublicKeyDefault = "Public-Key-Not-Specified";

        public CryptoGraphy()
        {
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            OperationOrder = 5;
        }

        public async void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            string url = ServicesCommon.ServerUrl + "/api/CryptoApi/GetKeyVersion";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(url));
            request.ContentType = "application/json";
            request.Method = "POST";
            using (WebResponse webResponse = await request.GetResponseAsync())
            {
                // Get a stream representation of the HTTP web response:
                using (Stream stream = webResponse.GetResponseStream())
                {
                    // Use this stream to build a JSON document object:
                    JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
                    ResponseBase<int> response =
                        JsonConvert.DeserializeObject<ResponseBase<int>>(jsonDoc.ToString());
                    if (response.Success)
                    {
                        int serverCryptoKeyVersion = response.ResponseData;
                        if (serverCryptoKeyVersion != LocalServerCryptoKeyVersion) //local vs server version  mismatch
                        {
                            updateLocalServerCryptoKeyPublic();

                        }
                    }
                    else
                    {
                        //response.Success=false
                    }
                }
            }
        }

        private async void updateLocalServerCryptoKeyPublic()
        {
            string url = ServicesCommon.ServerUrl + "/api/CryptoApi/GetPublicKey";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(url));
            request.ContentType = "application/json";
            request.Method = "POST";
            using (WebResponse webResponse = await request.GetResponseAsync())
            {
                // Get a stream representation of the HTTP web response:
                using (Stream stream = webResponse.GetResponseStream())
                {
                    // Use this stream to build a JSON document object:
                    JsonValue jsonDoc = await Task.Run(() => JsonObject.Load(stream));
                    ResponseBase<string> response =
                        JsonConvert.DeserializeObject<ResponseBase<string>>(jsonDoc.ToString());
                    if (response.Success)
                    {
                        LocalServerCryptoKeyPublic = response.ResponseData;
                    }
                    else
                    {
                        //response.Success=false
                    }
                }
            }
        }

        public void CreateTable(object locker)
        {
            throw new NotImplementedException();
        }

        public Task PopulateTableDataFromServer(object locker)
        {
            throw new NotImplementedException();
        }

        public void RemoveTableData(object locker)
        {
            throw new NotImplementedException();
        }


        public int LocalServerCryptoKeyVersion
        {
            get { return prefs.GetInt(LocalServerPublicKeyVersionKey, LocalServerPublicKeyVersionDefault); }
            private set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalServerPublicKeyVersionKey, value);
                editor.Commit();
            }
        }

        public string LocalServerCryptoKeyPublic
        {
            get { return prefs.GetString(LocalServerPublicKeyKey, LocalServerPublicKeyDefault); }
            private set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutString(LocalServerPublicKeyKey, value);
                editor.Commit();
            }
        }

        public string EncryptWithServerKey(string simpleString)
        {
            byte[] simpleBytes = Encoding.Unicode.GetBytes(simpleString);
            byte[] encryptedBytes;
            string encryptedString;
            RSACryptoServiceProvider rsaToEncrypt = new RSACryptoServiceProvider();
            rsaToEncrypt.FromXmlString(LocalServerCryptoKeyPublic);
            encryptedBytes = rsaToEncrypt.Encrypt(simpleBytes, false);
            encryptedString = Convert.ToBase64String(encryptedBytes);
            return encryptedString;
        }


    }
}