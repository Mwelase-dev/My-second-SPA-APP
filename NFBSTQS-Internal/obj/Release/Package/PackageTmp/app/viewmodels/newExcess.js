define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
    var sections = ko.observableArray();
    var ExcessDescription = ko.observable();
    var ExcessDescriptionValue = ko.observable();
    var WarrantyShortDescription = ko.observable();
    var SectionId = ko.observable();
     
    var activate = function () {
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }
 
    var save = function () {
        if (ExcessDescription()) {
            //var x = document.getElementById("cmbsections").value;
            var data = {
                ExcessDescriptionValue: ExcessDescriptionValue(),
                ExcessDescription: ExcessDescription() 
            }
            return dtx.saveExcess(data).then(function (result) {
                if (result) {
                    toastr.success("Excess is saved");
                    window.location.href = '#/manageExcesses';
                }
           });
        } else {
            toastr.warning("You cannot save null values");
        }
    }

    var close = function () {
        return app.showMessage('Are you sure you want to cancel creating this excess', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                var form = document.getElementById("newExcess");
                form.reset();
                window.location.href = '#/manageExcesses';
            }
        });
    };

    var vm = {
        activate: activate,
        sections: sections,
        save: save,
        close: close,
        ExcessDescription: ExcessDescription,
        WarrantyShortDescription: WarrantyShortDescription,
        ExcessDescriptionValue: ExcessDescriptionValue,
        SectionId: SectionId
    };

    return vm;
});