
define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app', 'toastr'],
    function (dialog, ko, dtx, nl, app, toastr) {
        var insuredItems = ko.observableArray();
        var ratingModel = ko.observableArray();
        var FeeDescription = ko.observable("");
        var FeeValue = ko.observable("");
        var FeePercantage = ko.observable("");

        var save = function () {
            if (FeeDescription(), FeeValue(), FeePercantage()) {
                var data = {
                    FeeDescription: FeeDescription(),
                    FeeValue: FeeValue(),
                    FeePercantage: FeePercantage()
                }
                return dtx.addFee(data).then(function (result) {
                    if (result) {
                        toastr.success("Fee is saved");
                        window.location.href = '#/manageCompulsoryFees';
                    }
                });

            } else {
                toastr.warning("You cannot save null values");
            }

        }
        var activate = function () {
            return dtx.getSectionsForDropdown().then(function (result) {
                insuredItems(result);
            });
        }
        var getInsuredItemDetails = function () {
            dtx.getInsuredItemDetails(insuredItems);
            var test = insuredItems();
        }
        var close = function () {
            return app.showMessage('Are you sure you want to cancel adding this fee', 'Leaving', ['Yes', 'No']).then(function (result) {
                if (result === "Yes") {
                    var form = document.getElementById("newFee");
                    form.reset();
                    history.back(1);
                }
            });

        };


        var vm = {
            ratingModel: ratingModel,
            getInsuredItemDetails: getInsuredItemDetails,
            activate: activate,

            save: save,
            close: close,


            FeeDescription: FeeDescription,
            FeeValue: FeeValue,
            FeePercantage: FeePercantage


        };
        return vm;
    });