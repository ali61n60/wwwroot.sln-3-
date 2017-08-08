using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Preferences;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ChiKoja.CryptoService;

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

        public void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            CryptoService.CryptoService cryptoService = new CryptoService.CryptoService();

            ResponseBaseOfint response = cryptoService.GetKeyVersion();
            if (response.Success)
            {
                int serverCryptoKeyVersion = response.ResponseData;
                if (serverCryptoKeyVersion != LocalServerCryptoKeyVersion)//local vs server version  mismatch
                {
                    ResponseBaseOfstring publicKeyResponse = cryptoService.GetPublicKey();
                    if (publicKeyResponse.Success)
                    {
                        LocalServerCryptoKeyPublic = publicKeyResponse.ResponseData;
                    }
                }
            }
            else
            {
                //error in getting data from server
            }
        }

        public void CreateTable(object locker)
        {
            throw new NotImplementedException();
        }

        public void PopulateTableDataFromServer(object locker)
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