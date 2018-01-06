define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
    var sections = ko.observableArray();
    var WarrantyDescription = ko.observable();
    var WarrantyShortDescription = ko.observable();
    var SectionId = ko.observable();
     
    var activate = function () {
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }
 
    var save = function () {
        if (WarrantyDescription()) {
            var x = document.getElementById("cmbsections").value;
            var data = {
                sectionId: SectionId(),
                WarrantyDescription: WarrantyDescription() 
            }
            return dtx.addWarranty(data).then(function (result) {
                if (result) {
                    toastr.success("Warranty is saved");
                    window.location.href = '#/manageWarranties';
                }
           });
        } else {
            toastr.warning("You cannot save null values");
        }
    }

    var close = function () {
        return app.showMessage('Are you sure you want to cancel creating this warranty', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                var form = document.getElementById("newWarranty");
                form.reset();
                window.location.href = '#/manageWarranties';
            }
        });
    };

    var vm = {
        activate: activate,
        sections: sections,
        save: save,
        close: close,
        WarrantyDescription: WarrantyDescription,
        WarrantyShortDescription : WarrantyShortDescription,
        SectionId: SectionId
    };

    return vm;
});