define(['knockout', 'services/datacontext', 'durandal/app','toastr'],
    function (ko, dtx, app, toastr) {
        var excesses = ko.observableArray();
       
        function getExcesses() {
          
            return dtx.getAllExcess(excesses);
        }
         
        function getExcessToModify(excess) {
            var objectToSendForModification = JSON.stringify(excess);
            localStorage.setItem('TheExcessObject', objectToSendForModification);
             
            window.location.href = '#/editExcess';
        }

        var removeExcess = function (excess) {
            return app.showMessage('Are you sure you want remove this excess', 'Removing', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    excesses.remove(excess);
                    dtx.deleteExcess(excess.ExcessId);
                    toastr.success("Excess deleted");
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
            return dtx.getAllExcess(excesses);
        }

        var vm = {
            activate: activate,
            excesses: excesses,

            getExcesses: getExcesses,
        
            getExcessToModify: getExcessToModify,
            removeExcess: removeExcess,
            formatCurrency: formatCurrency,
            numberWithCommas: numberWithCommas

        };
        return vm;
    });