using System;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using NFBSTQS_Internal.Security;
using QsClasses;
using QsDataAccess.Repo;

namespace NFBSTQS_Internal.Controllers
{
    public class UsersController : ApiController
    {
        #region Debug Code
#if DEBUG
        [HttpGet]
        public UserAuth TestAuth()
        {
            return new UserAuth { UserName = "qbarnard@gmail.com", Password = "password" };
        }

        [HttpGet]
        public User TestUser()
        {
            return new User { UserName = "qbarnard@gmail.com", Password = "password" };
        }
#endif
        #endregion

        [HttpPost]
        public HttpResponseMessage CreateNewUser(User user)
        {
            var result = IdentityProvider.RegisterUser(user);
            return Request.CreateResponse(result == ResponseType.AccountCreated || result == ResponseType.AccountSuccess ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }


        [HttpPost]
        public HttpResponseMessage Authenticate(UserBase userAuth)
        {
            var ipAddress = HttpContext.Current.Request.UserHostAddress;
            var result = IdentityProvider.IsValidUser(userAuth);
            if (result != ResponseType.AccountSuccess) return HttpMessages.CreateRespone(Request, HttpStatusCode.Unauthorized, result);

            try
            {
                return HttpMessages.CreateRespone(Request, HttpStatusCode.OK, IdentityProvider.GetUserToken(userAuth, ipAddress));
            }
            catch (Exception ex)
            {
#if DEBUG
                return HttpMessages.CreateRespone(Request, HttpStatusCode.InternalServerError, ex.Message);
#else
                return HttpMessages.CreateRespone(Request, HttpStatusCode.InternalServerError, ResponseType.TokenFailed);
#endif
            }
        }
 
    }
}
