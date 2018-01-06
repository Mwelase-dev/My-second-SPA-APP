define(['plugins/dialog', 'knockout', 'services/datacontext'], function (dialog, ko, dtx) {
    var currDirector = ko.observable();
    var loadingTypes = ko.observableArray();
    var customModal = function () {
        this.input = currDirector();
    };

    function getLoadingTypes()
    {
        dtx.getLoadingTypes(loadingTypes)
        var test = loadingTypes();
    }
    customModal.prototype.close = function () {
        dialog.close(this);
    };
    customModal.prototype.load = function () {
        return dtx.getLoadingTypes(loadingTypes);
    };

 

    customModal.show = function (eventData) {
        currDirector(eventData);
        return dialog.show(new customModal());
    };

    return customModal;

    var vm = {
        getLoadingTypes : getLoadingTypes
    };
    return vm;
});