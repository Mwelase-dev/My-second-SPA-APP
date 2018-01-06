using System;
using System.Collections.Generic;
using CustomModels;
using QsClasses;

namespace BreezeWebAPI.Security
{
    public class IdentityStore
    {
        private static readonly Dictionary<string, string> Users = new Dictionary<string, string>
        {
            { "Alex"   , "@lex"    },
            { "Cruz"   , "cruz007" },
            {"Sanjay"  , "pass"    },
            {"Quentin" , "Test"    }
        };

        public static bool IsValidUser(User user)
        {
            if (!Users.ContainsKey(user.UserId))
                return false;

            return Users[user.UserId] == user.Password;
        }

        public static bool IsValidUserId(string userId)
        {
            return Users.ContainsKey(userId);
        }

    }
}
