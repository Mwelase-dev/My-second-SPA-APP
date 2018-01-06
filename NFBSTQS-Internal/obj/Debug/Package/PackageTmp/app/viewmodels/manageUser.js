define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app', 'toastr'], function (dialog, ko, dtx, $, app, toastr) {
    var users = ko.observableArray();
    var roles = ko.observableArray();
    var roleId = ko.observable("");
    var user = ko.observable("");

    function activate() {
        loadRoles();
        loadUser();
    }

    var close = function () {
        history.back(-1);
    };

    var saveAssignment = function () {
        return dtx.updateUserAccountByUserId(user()).then(function (result) {
            if (result) {
                toastr.success("User updated");
            }
       });
    }

    var loadUser = function () {
        var theUser = localStorage.getItem('TheUser');

        if (theUser) {
            theUser = JSON.parse(theUser);
            //theUser.Password = "";
            user(theUser);
            localStorage.removeItem('TheUser');
        }
    }

    var loadRoles = function () {
        return dtx.getAllRoles().then(function (result) {
            roles(result);
        });
    }

    var save = function () {
        return dtx.updateUserAccountByUserId(user()).then(function (result) {
            if (result > 0) {
                toastr.success("User updated");
                window.location.href = '#/manageUserAccounts';
            } else {
                toastr.warning(result);
            }
        });
   
    }

    var loadAllUsers = function () {
        return users();
    }

    var loadAllRoles = function () {
        return roles();
    }


    var vm = {
        activate: activate,
        save: save,
        close: close,
        roleId: roleId,
        user: user,
        saveAssignment: saveAssignment,
        loadAllRoles: loadAllRoles,
        loadAllUsers: loadAllUsers



    };

    return vm;
});