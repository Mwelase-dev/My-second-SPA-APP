define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {

    var busyWorking = ko.observable(0);
     

    var activate = function () {
       
    }

   

    var vm = {
        activate: activate,
        busyWorking: busyWorking 
    };
    return vm;
});