define(['durandal/app', 'plugins/router', 'knockout', 'datacontext', 'bootstrap', 'toastr'],function (app, router, ko, dtx, bootstrap, toaster) {
    var waranties = ko.observableArray();
    var selectedWarranties = ko.observableArray();

    var loadWarranties = function() {
        var data = localStorage.getItem('TheWarranties');
        if (data) {
            data = JSON.parse(data);
            waranties(data);

            localStorage.removeItem('TheWarranties');
        }
    }

        function activate() {
            loadWarranties();
        }

        var save = function () {
            var objectToSend = JSON.stringify(selectedWarranties());

            localStorage.setItem('TheSelectedWarranties', objectToSend);
            location.href = '#/quote';
        }

        var close = function() {
            return app.showMessage('Are you sure you want to cancel adding warranties', 'Leaving', ['Yes', 'No']).then(function (result) {
                if (result === "Yes") {
                    //var form = document.getElementById("warrantyPopUp");
                    //form.reset();
                   
                    history.back(-1);
                }
            });
        }

        var vm = {
            activate: activate,
            waranties: waranties,
            selectedWarranties: selectedWarranties,
            save: save,
            close: close
        };

        return vm;
    });