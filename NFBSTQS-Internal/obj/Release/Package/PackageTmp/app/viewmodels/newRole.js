define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app'], function (dialog, ko, dtx, $, app) {
    var userModel = ko.observableArray();
    var roleName = ko.observable("");
      
        function activate() {
            return;
        }

        
        var createNewRole = function () {
            var data = {
                roleName: roleName() 
            }
            dtx.createNewRole(data);
        }
        var save = function () {
            createNewRole();
            app.showMessage('Role is created', 'Save success', ['Ok']);
            history.back(1);
        }
        //var canDeactivate = function () {
            //app.showMessage('User is created', 'Save success', ['Ok']);
        //};

        var close = function () {
            history.back(1);
        };

        
    var vm = {
        activate: activate,
        save: save,
        close: close,
        createNewRole: createNewRole,
        roleName: roleName
};

        return vm;
    });