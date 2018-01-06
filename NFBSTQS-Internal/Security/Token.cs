using System;
using System.IO;
using System.Linq;
using System.Web.Hosting;

namespace NFBSTQS_Internal.Security
{
    public class Token
    {
       //private const string CertFileName = @"D:\Projects\NFB Short Term\NFBST Quote System\NFBSTQS-Internal\App_Data\localhost.pfx";
        private static string CertFileName = AppDomain.CurrentDomain.BaseDirectory + "\\App_Data\\localhost.pfx";
        public string UserId { get; private set; }
        public string Ip     { get; private set; }
        
        public Token(string userId, string fromIp)
        {
            UserId = userId;
            Ip     = fromIp;
        }

        public string Encrypt()
        {
            DirectoryInfo di = new DirectoryInfo(CertFileName);
            var cryptographyHelper = new CryptographyHelper();
            var certificate = cryptographyHelper.GetX509Certificate(CertFileName);
            return cryptographyHelper.Encrypt(certificate, ToString());
        }

        public static Token Decrypt(string encryptedToken)
        {

            var cryptographyHelper = new CryptographyHelper();
            var certificate = cryptographyHelper.GetX509Certificate(CertFileName);
            var decrypted   = cryptographyHelper.Decrypt(certificate, encryptedToken);

            // Splitting it to dictionary
            // [UserId=someguidvalue;Ip=127.0.0.1]
            var dictionary = decrypted.Split(';').Select(part => part.Split('=')).ToDictionary(split => split[0], split => split[1]);
            return new Token(dictionary["UserId"], dictionary["Ip"]);
        }

        public override string ToString()
        {
            return String.Format("UserId={0};Ip={1}", UserId, Ip);
        }
    }
}
