using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using NFBSTQS_Internal.Controllers;

namespace NFBSTQS_Internal.Security
{
    public class HttpsGuard : DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (request.RequestUri.Scheme.Equals(Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase))
                return base.SendAsync(request, cancellationToken);

            return Task.FromResult(HttpMessages.CreateRespone(request, HttpStatusCode.Forbidden, ResponseType.RequestHttps));
        }        
    }
}