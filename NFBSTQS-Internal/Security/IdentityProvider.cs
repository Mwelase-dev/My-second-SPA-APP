using System;
using System.Linq;
using NFBSTQS_Internal.Controllers;
using QsClasses;
using QsDataAccess.Repo;

namespace NFBSTQS_Internal.Security
{
    public class IdentityProvider
    {
        #region Private Methods
        private static bool CheckPass(string inPass, UserBase inUser)
        {
            return PasswordHash.ValidatePassword(inPass, inUser.Password);
        }

        //private static string NewPassGen()
        //{
        //    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        //    var stringChars = new char[8];
        //    var random      = new Random();
        //    for (int i = 0; i < stringChars.Length; i++)
        //    {
        //        stringChars[i] = chars[random.Next(chars.Length)];
        //    }
        //    return new String(stringChars);
        //}
        
        private static bool CreateAccount(User user)
        {
            var salt = PasswordHash.CreateSalt();
            user.Password = PasswordHash.CreateHash(user.Password, salt.ToArray());

            if (user.UserId != Guid.Empty)
            {
                return QsDataRepository.CreateNewUser(user, salt);
            }
            //New user
            //user.UserId = Guid.NewGuid();
            return QsDataRepository.CreateNewUser(user, salt);
        }
        #endregion

        #region Public Members
        public static ResponseType RegisterUser(User user)
        {
            //update existing account
            if (user.UserId != Guid.Empty)
            {
                if (user.Password == null)
                {
                     user.Password = (IsValidUserPassword(user.UserName));
                }
               
               if(CreateAccount(user)) return ResponseType.AccountSuccess;
            }

            //Check that we have an account
            if (user == null || String.IsNullOrWhiteSpace(user.UserName)) return ResponseType.AccountInvalid;

            // Check for duplicate user ID's
            if (IsValidUserName(user.UserName)) return ResponseType.AccountExists;

            // Check that passwords match
            if (String.IsNullOrWhiteSpace(user.Password)) return ResponseType.PasswordEmpty;

            // Check that passwords match
            //if (!user.UserPass.Equals(user.UserPassConf)) return ResponseType.PasswordNotMatching;

            // All Good, Create account
            if (!CreateAccount(user)) return ResponseType.AccountFailed;

            //Send Welcoming email
            //EmailMessages.AccountCreated(user.UserName);
            return ResponseType.AccountCreated;
        }
        
        // Checks User Credentials
        public static ResponseType IsValidUser(UserBase user)
        {
            //Check that we have an account
            if (user == null || String.IsNullOrWhiteSpace(user.UserName)) return ResponseType.AccountInvalid;

            // Check that passwords match
            if (String.IsNullOrWhiteSpace(user.Password)) return ResponseType.PasswordEmpty;

            // Check that the account exists
            if (!IsValidUserName(user.UserName)) return ResponseType.AccountInvalid;

            // We found the account
            var value = QsDataRepository.GetAllUsers().First(x => x.UserName == user.UserName);
            if (value != null)
            {
                return CheckPass(user.Password, value) ? ResponseType.AccountSuccess : ResponseType.AccountInvalid;
            }
            return ResponseType.AccountInvalid;
        }

        // Creates token
        public static object GetUserToken(UserBase user, string ipAddress)
        {
            // Check that the account exists
            if (!IsValidUserName(user.UserName)) return ResponseType.AccountInvalid;

            // We found the account
            var value = QsDataRepository.GetAllUsers().First(x => x.UserName.Equals(user.UserName));
            if (value != null)
            {
                return new { Token = new Token(value.UserId.ToString(), ipAddress).Encrypt() };
            }
            return ResponseType.AccountInvalid;
        }

        // Is valid user account, by Name
        public static bool IsValidUserName(string userName)
        {
            try
            {
                var result = QsDataRepository.GetAllUsers().First(x => x.UserName.Equals(userName));
                return result != null;
            }
            catch
            {
                return false;
            }
        }

        //Is valid user account, userName to get pasword
        public static string IsValidUserPassword(string userName)
        {
            try
            {
                var result = QsDataRepository.GetAllUsers().First(x => x.UserName.Equals(userName));
                return result.Password;
            }
            catch
            {
                return null;
            }
        }
        
        
        // Is valid user account, by ID
        public static User IsValidUserId(string userId)
        {
            try
            {
                return QsDataRepository.GetAllUsers().First(x => x.UserId.Equals(new Guid(userId)));
            }
            catch
            {
                return null;
            }
        }
        #endregion
    }
}
