using System.Collections.Generic;
using System.Net;
using System.Net.Http;

namespace NFBSTQS_Internal.Controllers
{
    public enum ResponseType
    {
        // General System Messages HTTP 401
        RequestBad,
        RequestHttps,
        Unauthorized,
        TokenMissing,
        TokenClientBad,
        TokenInvalid,
        TokenFailed,

        // User Account Messages
        AccountExists,
        AccountCreated,
        AccountFailed,
        AccountRequired,
        AccountInvalid,
        AccountSuccess,
        AccountResetSuccess,
        AccountResetFailed,
        PasswordNotMatching,
        PasswordEmpty,

        // User Device Messages
        SerialNumberInvalid,
        SerialNumberExists,
        ErrorSavingData,
        SavedData,
        SaveFailed
    }

    public class HttpMessages
    {
        #region Private Members
        private static readonly Dictionary<ResponseType, string> ReponseDictionary = new Dictionary<ResponseType, string>
        {
            { ResponseType.RequestBad         , "Bad Request"                               },
            { ResponseType.RequestHttps       , "HTTPS is required to access this service." },
                                              
            { ResponseType.TokenClientBad     , "Invalid indentity or client machine."      },
            { ResponseType.TokenInvalid       , "Invalid token."                            },
            { ResponseType.TokenMissing       , "Request is missing authorization token."   },
            { ResponseType.TokenFailed        , "There was an error working with the token."},
                                              
            { ResponseType.AccountExists      , "Please use different credentials."         },
            { ResponseType.AccountCreated     , "Your account has been created."            },
            { ResponseType.AccountFailed      , "Failed to create the account."             },
            { ResponseType.AccountRequired    , "Please supply account credentials."        },
            { ResponseType.AccountInvalid     , "Invalid username and/or password."         },
            { ResponseType.Unauthorized       , "You are not authorized currently."         },
                                                                                            
            { ResponseType.AccountSuccess     , "Successfully signed in."                   },
            { ResponseType.AccountResetSuccess, "Your account has been reset."              },
            { ResponseType.AccountResetFailed , "Resetting your account failed!"            },
            { ResponseType.PasswordNotMatching, "Your passwords do not match."              },
            { ResponseType.PasswordEmpty      , "Mmmmm, password empty..."                  },

            { ResponseType.SerialNumberInvalid, "Serial number is invalid or empty."        },
            { ResponseType.SerialNumberExists , "Serial number has already been registered."},
            { ResponseType.ErrorSavingData    , "An error occured saving the data."         },
            { ResponseType.SavedData          , "Data saved successfully"                   },
            { ResponseType.SaveFailed         , "Data was not saved successfully!"          }
        };
        #endregion
        
        public static HttpResponseMessage CreateRespone(HttpRequestMessage request, HttpStatusCode code, object data)
        {
             return request.CreateResponse(code, data.GetType() == typeof(ResponseType) ? ReponseDictionary[(ResponseType)data] : data);
        }
    }
}