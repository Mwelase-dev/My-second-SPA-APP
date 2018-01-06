define(['plugins/dialog', 'knockout', 'services/datacontext'], function (dialog, ko, dtx) {
    var currDirector = ko.observable();
    var insuredItems = ko.observableArray();
    var customModal = function () {
        this.input = currDirector();
    };

    customModal.prototype.getInsuredItemDetails=function(){
      dtx.getInsuredItemDetails(insuredItems);
        var test = insuredItems();
    }
    customModal.prototype.close = function () {
        dialog.close(this);
    };
    customModal.prototype.load = function () {
        return dtx.getInsuredItemDetails(insuredItems);
    };

    customModal.prototype.submit = function(result) {
        var formData = {
            ClientFName        : $('#clientName').val(),
            ClientSName        : $('#clientSurname').val(),
            CEmail             : $('#email').val(),
            Message            : $('#msg').val(),
            currentStaffEmail  : result.StaffEmailAddress
        };
        var test = formData;//need to send this object to dtx;
        dtx.sendEmail(formData);
    };

    customModal.show = function (eventData) {
        currDirector(eventData);
        return dialog.show(new customModal());
    };

    return customModal;

    var vm = {
        getInsuredItemDetails: getInsuredItemDetails
    };
    return vm;
});