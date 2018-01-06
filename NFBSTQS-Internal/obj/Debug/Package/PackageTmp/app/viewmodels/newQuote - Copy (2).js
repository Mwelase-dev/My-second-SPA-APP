define(['durandal/system', 'durandal/app', 'jquery', 'knockout', 'services/datacontext'],
    function (system, app, $, ko, dtx) {
     
    var quoteModel = function (insuredItems) {
        var self = this;

        self.insuredItems = ko.observableArray(insuredItems);
      
        self.addInsuredItem = function () {
            self.insuredItems.push({
                name: "",
                price: ""
            });
        };

        self.removeInsuredItem = function (item) {
            self.insuredItems.remove(item);
        };

        self.save = function (form) {
            //dtx.addQuote(self.insuredItems);
            dtx.addQuote(JSON.stringify(ko.toJS(self.insuredItems), null, 2));
            history.back(1);
        };

        self.activate = function () {
            console.log('activate grid');
        };

        self.canActivate = function () {
            console.log('canActivate grid');
            return true;
        };

        self.canDeactivate = function () {
            return app.showMessage('Are you sure you want to cancel doing the quote?', 'Leaving', ['Yes', 'No']);
        };

        self.deactivate = function () {
            console.log('deactivate grid');
        };

        self.close = function() {
            history.back(1);
        };

        









        //var loadingsAndDiscounts = ko.observableArray();
        //self.allItems = function() {
        //    return dtx.getLoadingsAndDiscounts(loadingsAndDiscounts);
        //};

        self.allLoadings = ko.observableArray(["Unoccupancy", "Hatch Roof", "JHB", "CPT", "PE/DBN", "Excess waiver", "Total car hire"]);
        self.allDiscounts = ko.observableArray(["Country Area", "Alarm", "NCB", "Gear lock", "Tracker", "2nd Car"]);
    };
    return new quoteModel([]);
    });

//self.quotes = ko.observableArray(ko.utils.arrayMap(quotes, function(quote) {
        //    return {ClientName : quote.ClientName, QuoteDate : quote.QuoteDate, UnderWriter : quote.UnderWriter,MobileNumber : quote.MobileNumber , insuredItems : ko.observableArray(quote.insuredItems)}
        //}));

        //self.createQuote = function() {
        //    self.quotes.push({
        //        ClientName: "",
        //        QuoteDate: "",
        //        UnderWriter: "",
        //        MobileNumber: "",
        //        insuredItems : ko.observableArray

        //    });
        //};