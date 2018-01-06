define(['knockout', 'services/datacontext', 'viewmodels/newItem', 'viewmodels/insuredItemsModal', 'durandal/app'],
    function (ko,dtx,ni,iim,app) {
        var quoteItems = ko.observableArray();
        var insuredItems = ko.observableArray();
        var itemsByQuoteId = ko.observableArray();
        var clientDetails = ko.observableArray();
         
        function activate() {
            var quote = localStorage.getItem('TheQuoteObject');
            if (quote) quote = JSON.parse(quote);
            loadInsuredItems(quote);
            clientDetails(quote);
            getQuoteItems();
        }
  
        var loadInsuredItems = function (quote) {
            return dtx.getItemsByQuoteId(quote.QuoteId).then(function (result) {
                insuredItems(result);
                var test = insuredItems();
                quote.InsuredItems = insuredItems();
            });
        }

        var getClientDetails = function () {
            return clientDetails();
        }

        var getQuoteItems = function() {
            return insuredItems();
        }

        var removeItem = function (insuredItem) {
            return app.showMessage('Are you sure you want delete this item', 'Removing', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    insuredItems.remove(insuredItem);
                }
            });
        }

        var getInsuredItemDetails = function (insuredItem) {
            var objectToSendForModification = JSON.stringify(insuredItem);
            localStorage.setItem('TheInsuredItemObject', objectToSendForModification);

            window.location.href = '#/editItem';
        }

      
        var vm = {
            activate: activate,
            insuredItems : insuredItems,
            quoteItems: quoteItems,
              
            loadInsuredItems: loadInsuredItems,
            getQuoteItems: getQuoteItems,
            removeItem: removeItem,
            clientDetails: clientDetails,
            getClientDetails : getClientDetails,
        

            getInsuredItemDetails: getInsuredItemDetails
        };

        return vm;
    });