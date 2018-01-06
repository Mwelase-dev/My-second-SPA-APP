define(['knockout', 'services/datacontext', 'durandal/app','toastr'],
    function (ko, dtx, app, toastr) {
        var commisions = ko.observableArray();
      
      
        function getcommisions() {
          
            return dtx.getAllCommisions(commisions);
        }

       

        function getCommisionToModify(commision) {
            var objectToSendForModification = JSON.stringify(commision);
            localStorage.setItem('TheCommisionObject', objectToSendForModification);
             
            window.location.href = '#/editCommision';
        }

        var removeCommisions = function (commision) {
            return app.showMessage('Are you sure you want remove this commision', 'Removing', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    commisions.remove(commision);
                    dtx.deleteCommision(commision.CommisionId);
                    toastr.success("Commision deleted");
                }
            });
        }
        function formatCurrency(value) {
            var test = "R" + value.toFixed(2);
            return test;
        }

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(".");
        }
        function activate() {
            return dtx.getAllCommisions(commisions);
        }

        var vm = {
            activate: activate,
            commisions: commisions,

            getcommisions: getcommisions,
        
            getCommisionToModify: getCommisionToModify,
            removeCommisions: removeCommisions,
            formatCurrency: formatCurrency,
            numberWithCommas: numberWithCommas

        };
        return vm;
    });