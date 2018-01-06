define(
    function () {
        //toastr.options.timeOut = 4000;
        //toastr.options.positionClass = 'toast-bottom-right';

        var siteName = 'NFB ST Quote';
        var debugOn = true;
        var siteRoot = 'shell';
        var apiPath = '/Api/StQuoteData';
        var dtFormat = 'DD MMM YYYY';

        return {
            siteName: siteName,
            debugOn: debugOn,
            siteRoot: siteRoot,
            apiPath: apiPath,
            dtFormat: dtFormat
        };
    });