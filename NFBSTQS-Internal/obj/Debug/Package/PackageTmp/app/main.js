requirejs.config({
    paths: {

        'text'             : '../scripts/text',
        'jquery'           : '../scripts/jquery-1.9.1.min',
        'durandal'         : '../scripts/durandal',
        'plugins'          : '../scripts/durandal/plugins',
        'transitions'      : '../scripts/durandal/transitions',
        'ko'               : '../scripts/knockout-3.2.0.debug',
        
         
        'bootstrap'        : '../scripts/bootstrap',
        'jqcycle'          : '../scripts/jquery/jquery.cycle.all.2.72',
        'jqhoveraccordion'          : '../scripts/jquery/jquery.hoveraccordion',
        'jqvticker'                 : '../scripts/jquery/jquery.vticker-min',
        

                           
        'datacontext'               : '../app/services/datacontext',
        'toastr'                    : '../scripts/toastr',
        'koGrid'                : '../scripts/koGrid-2.1.1',
        'moment'                : '../scripts/moment-with-locales'
    },
    map: {
        //knockout used by Durandal, ko used by breeze  --> anytime ko is requested, substitute knockout
        '*': { 'knockout': 'ko' }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator','services/config'], function (system, app, viewLocator, config) {
    system.debug(true);

    app.title = config.siteName;

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true
    });

    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot(config.siteRoot);//load the master layout
    });
});