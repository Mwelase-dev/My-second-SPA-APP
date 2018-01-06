using System;
using System.Security.Principal;
using System.Web.Security;

namespace NFBSTQS_Internal.Security
{
    public class CustomPrincipal : IPrincipal
    {
        public IIdentity Identity { get; private set; }
        public Guid      UserId   { get; set; }

        public bool IsInRole(string role)
        {
            return Identity.IsAuthenticated && !string.IsNullOrWhiteSpace(role) && Roles.IsUserInRole(Identity.Name, role);
        }
        
        public CustomPrincipal(string userName, Guid userId)
        {
            Identity = new GenericIdentity(userName);
            UserId   = userId;
        }
    }
}