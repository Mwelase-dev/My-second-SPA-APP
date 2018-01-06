define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app', 'toastr'], function (dialog, ko, dtx, $, app, toastr) {
    var userModel = ko.observableArray();
    var staffName     = ko.observable("");
    var staffLastName = ko.observable("");
    var username      = ko.observable("");
    var password = ko.observable("");
    var roleId = ko.observable("");
    var roles = ko.observableArray();




        function activate() {
            loadRoles();
        }

        
        var createNewUserAccount = function() {
            
            
        }
        var save = function () {
            var operationResult = false;
            var data = {
                firstName: staffName(),
                lastName: staffLastName(),
                username: username(),
                password: password(),
                roleId: roleId()

            }
            return dtx.createNewUser(operationResult,data).then(function (result) {
                if (result) {

                    staffName('');
                    staffLastName('');
                    username('');
                    password('');
                    toastr.success("User is created");
                    window.location.href = '#/manageUserAccounts';

                }
            });
        }

        var close = function () {
            return app.showMessage('Are you sure you want to cancel creating this usser account', 'Leaving', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    var form = document.getElementById("newUser");
                form.reset();
                    history.back(1);
                }
            });
        };
        var loadRoles = function () {
            return dtx.getAllRoles().then(function (result) {
                roles(result);
            });

        }
        var loadAllRoles = function () {
            return roles();
        }
        
    var vm = {
        activate: activate,
        save: save,
        close: close,
        //canDeactivate: canDeactivate,
        createNewUserAccount: createNewUserAccount,
        staffName: staffName,
        staffLastName: staffLastName,
        username: username,
        password: password,
        roleId : roleId,
        loadAllRoles: loadAllRoles,

        //canDeactivate: canDeactivate,
        //deactivate: deactivate

};

        return vm;
    });