using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Services;
using RSACryptoServiceProviderExtensions;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class CryptoApiController:Controller
    {
        private int KeyVersion = 1;

        private static string xmlPublicKey = "<RSAKeyValue><Modulus>kKLghgD4/uPHj7mmyx7s+RTWVhsViMKf4pGOwCWyVfKMMWFtNhDoDuICxBcRq7KqCoAvI8B6OJcc8nKbHOBHz9QRx497wTr4OXH0BCpyctwSnvMeQD05L7x9pBwOJgQNhx7o9BALmIauNZIvjanSuQDPsUQoCA2pV9GKdOMtvr0=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";

        private static string xmlPublicAndPrivateKeys = " <RSAKeyValue><Modulus>kKLghgD4/uPHj7mmyx7s+RTWVhsViMKf4pGOwCWyVfKMMWFtNhDoDuICxBcRq7KqCoAvI8B6OJcc8nKbHOBHz9QRx497wTr4OXH0BCpyctwSnvMeQD05L7x9pBwOJgQNhx7o9BALmIauNZIvjanSuQDPsUQoCA2pV9GKdOMtvr0=</Modulus><Exponent>AQAB</Exponent><P>ymbeqUcemNK3cuM+q3B6LPrw8P1llD+8j5bNBWxQn8qRQx4N8gZJdrSfQgBsyaYY/TL9a2dwKL4RfgFYgwiEOQ==</P><Q>tu/9Mr4DbyKONUOjCXmSqK/uwti2jvdS1/IbnIGoguGadhzSWLREdpVQnMxIyBdb+4EGKmwAsptorqWARjC2pQ==</Q><DP>V56u15M9MKVP20F6+NapXV2I/pqD5eitpW9/89APGw2jUu3o1ZRZKzVIGFd8wNLR0JLJWDygNlMJ2YWVnqwKKQ==</DP><DQ>PZJk3DFMIpm014SeWVAL5q7gY8BhIZlozrn0RSb2uqaIQHzO54A1EtyKt1uim4YRNYNlud2EFplsEGwv0nAO6Q==</DQ><InverseQ>c3jm2rdXyn8LrLz5nZGb2pszkZb3uoqjAOHNBimV24BPxIxWKnHGqXkJOBURnSVD2JgPXyKvq0mtHyLS+1ROAQ==</InverseQ><D>C6+NMmZ7t6RRqFQYnMqn3MwJMTXI/J606kpWXUHucbFCEG9NspOVHDa4gH1YqSWrRWPr6xiPB2l2JkSKMcARLSNUBN0gFWa6s1W3pDQYzB1yXmpPetM7Hr+eclNArD+dbRP/B4vmq1OPXW5L6yeu+CsriVHPddPTzhWXajJSpiE=</D></RSAKeyValue>";

        public ResponseBase<int> GetKeyVersion()
        {
            ResponseBase<int> response = new ResponseBase<int>();
            response.ResponseData = KeyVersion;
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<String> GetPublicKey()
        {
            ResponseBase<String> response = new ResponseBase<String>();
            response.ResponseData = xmlPublicKey;
            response.SetSuccessResponse();
            return response;
        }

        public static string Decrypt(string encryptedString)
        {
            byte[] encryptedBytes = Convert.FromBase64String(encryptedString);
            string decryptedString;
            byte[] decryptedBytes;
            RSACryptoServiceProvider rsaToDecrypt = new RSACryptoServiceProvider();
           
            rsaToDecrypt.FromXmlString(xmlPublicAndPrivateKeys);
            decryptedBytes = rsaToDecrypt.Decrypt(encryptedBytes, false);
            decryptedString = Encoding.Unicode.GetString(decryptedBytes);
            return decryptedString;
        }

        public static string Encrypt(string simpleString)
        {
            byte[] simpleBytes = Encoding.Unicode.GetBytes(simpleString);
            byte[] encryptedBytes;
            string encryptedString;
            RSACryptoServiceProvider rsaToEncrypt = new RSACryptoServiceProvider();
            rsaToEncrypt.FromXmlString(xmlPublicKey);
            encryptedBytes = rsaToEncrypt.Encrypt(simpleBytes, false);
            encryptedString = Convert.ToBase64String(encryptedBytes);
            return encryptedString;
        }
    }
}
