using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using NFBSTQS_Internal.Controllers;

namespace NFBSTQS_Internal.Security
{
    public class TokenInspector : DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            const string tokenName = "X-Token";
            IPrincipal principal;

            if (request.Headers.Contains(tokenName))
            {
                var encryptedToken = request.Headers.GetValues(tokenName).First();
                try
                {
                    var token                   = Token.Decrypt(encryptedToken);
                    var user                    = IdentityProvider.IsValidUserId(token.UserId);
                    var requestIpMatchesTokenIp = token.Ip.Equals(HttpContext.Current.Request.UserHostAddress);
                    if (user == null || !requestIpMatchesTokenIp)
                    {
                        var reply = HttpMessages.CreateRespone(request, HttpStatusCode.Unauthorized, ResponseType.TokenClientBad);
                        return Task.FromResult(reply);
                    }
                    principal = new CustomPrincipal(user.UserName, user.UserId);
                }
                catch
                {
                    var reply = HttpMessages.CreateRespone(request, HttpStatusCode.Unauthorized, ResponseType.TokenInvalid);
                    return Task.FromResult(reply);
                }
            }
            else
            {
                var reply = HttpMessages.CreateRespone(request, HttpStatusCode.Unauthorized, ResponseType.TokenMissing);
                return Task.FromResult(reply);
            }

            // Set the current user
            Thread.CurrentPrincipal  = principal;
            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }

            return base.SendAsync(request, cancellationToken);
        }
    }
}