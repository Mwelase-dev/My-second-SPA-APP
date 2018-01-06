define(['knockout', 'services/datacontext', 'durandal/app','toastr'],
    function (ko, dtx, app, toastr) {
        var warranties = ko.observableArray();
      
      
        function getWarranties() {
          
            return dtx.getAWarranties(warranties);
        }

       

        function getWarrantyToModify(warrantie) {
            var objectToSendForModification = JSON.stringify(warrantie);
            localStorage.setItem('TheWarrantyObject', objectToSendForModification);
             
            window.location.href = '#/editWarranty';
        }

        var removeWarranty = function (waranty) {
            return app.showMessage('Are you sure you want remove this rating', 'Removing', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    warranties.remove(waranty);
                    dtx.deleteWarranty(waranty.WarrantyId);
                    toastr.success("Waranty deleted");
                }
            });
        }
        function formatCurrency(value) {
            var test = "R" + value.toFixed(2);
            return test;
        }

        function numberWithCommas(x) {
            //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        function activate() {
            return dtx.getAWarranties(warranties);
        }

        var vm = {
            activate: activate,
            warranties: warranties,

            getWarranties: getWarranties,
        
            getWarrantyToModify: getWarrantyToModify,
            removeWarranty: removeWarranty,
            formatCurrency: formatCurrency,
            numberWithCommas: numberWithCommas

        };
        return vm;
    });