using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using NFBSTQS_Internal.Security;


namespace NFBSTQS_Internal
{
    public class Global : HttpApplication
    {
        //void Application_Start(object sender, EventArgs e)
        //{
        //    // Code that runs on application startup
        //    GlobalConfiguration.Configure(WebApiConfig.Register);
        //}

        protected void Application_Start()
        {
            var config = GlobalConfiguration.Configuration;
            var tokenInspector = new TokenInspector() { InnerHandler = new HttpControllerDispatcher(config) };
            //config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling      = ReferenceLoopHandling.Serialize; 
            //config.Formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.Objects; 

#if (!DEBUG)
            //For HTTPS
            config.MessageHandlers.Add(new HttpsGuard());
#endif

            config.Routes.MapHttpRoute(
                name: "Authentication",
                routeTemplate: "api/users/{action}/{id}",
                defaults: new { controller = "users", id = RouteParameter.Optional }
                );

            config.Routes.MapHttpRoute(
                name: "StQuoteData",
                routeTemplate: "api/data/{action}/{id}",
                constraints: null,
                handler: tokenInspector,
                defaults: new { controller = "StQuoteData", id = RouteParameter.Optional }
                );
        }
    }
}