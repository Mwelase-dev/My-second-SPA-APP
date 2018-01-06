using System;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace NFBSTQS_Internal.Security
{
    public class CryptographyHelper
    {
        public X509Certificate2 GetX509Certificate(string fileName)
        {
            try
            {
                var certificate = new X509Certificate2(fileName, "Welcome2");
                return certificate;
            }
            catch (Exception ex)
            {
                throw new Exception(String.Format("There was an error accessing the certificates for user validation - {0}", ex.Message));
            }
        }

        public string Encrypt(X509Certificate2 certificate, string plainToken)
        {
            var cryptoProvidor      = (RSACryptoServiceProvider)certificate.PublicKey.Key;
            var encryptedTokenBytes = cryptoProvidor.Encrypt(Encoding.UTF8.GetBytes(plainToken), true);
            return Convert.ToBase64String(encryptedTokenBytes);
        }

        public string Decrypt(X509Certificate2 certificate, string encryptedToken)
        {
            var cryptoProvidor      = (RSACryptoServiceProvider)certificate.PrivateKey;
            var decryptedTokenBytes = cryptoProvidor.Decrypt(Convert.FromBase64String(encryptedToken), true);

            return Encoding.UTF8.GetString(decryptedTokenBytes);
        }
    }
}