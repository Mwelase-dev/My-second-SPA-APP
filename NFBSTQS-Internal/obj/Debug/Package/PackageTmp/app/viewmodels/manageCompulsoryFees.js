define(['knockout', 'services/datacontext', 'durandal/app', 'toastr'],
    function (ko, dtx, app, toastr) {
        var fees = ko.observableArray();

        function activate() {
            dtx.getAllFees(fees);
        }
        
        var getFees = function () {
            dtx.getAllFees(fees);
            var test = fees();
        }
         
        var getFeeDetailsToModify = function(fee) {
            var objectToSendForModification = JSON.stringify(fee);
            localStorage.setItem('TheFeeObject', objectToSendForModification);
             
            window.location.href = '#/editFee';
        }

        var removeFee = function(fee) {
            return app.showMessage('Are you sure you want remove this fee', 'Removing', ['Yes', 'No']).then(function (result) {
                if (result === "Yes") {
                    fees.remove(fee);
                    dtx.deleteFeeById(fee.FeeId);
                    toastr.success("Fee deleted");
                }
            });
        }

        function formatCurrency(value) {
            var test = "R" + value.toFixed(2);
            return test;
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }

        var vm = {
            activate: activate,
            getFees: getFees,
            getFeeDetailsToModify: getFeeDetailsToModify,
            removeFee: removeFee,
            fees: fees,
            numberWithCommas: numberWithCommas,
            formatCurrency: formatCurrency
        };

        return vm;
    });