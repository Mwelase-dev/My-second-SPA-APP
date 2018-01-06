define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app', 'toastr'], function (dialog, ko, dtx, $, app, toastr) {
    var users = ko.observableArray();
    var roles = ko.observableArray();
    var roleId = ko.observable("");
    var userId = ko.observable("");
     
    function activate() {
        var RoleId = localStorage.getItem('RoleId');
        roleId(RoleId);
        localStorage.removeItem('RoleId');
        loadRoles();
    }
 
    var close = function () {
        history.back(1);
    };

    var saveAssignment = function () {
        loadUserId();
        var data = {
            roleId: roleId(),
            userId: userId()
        }
        dtx.assignUserToRole(data);
    }

    var loadUserId = function () {
        var TheUserId = localStorage.getItem('TheUserId');
        localStorage.removeItem('TheUserId');
        userId(TheUserId);
    }

    var loadRoles = function () {
        return dtx.getAllRoles().then(function (result) {
            roles(result);
        });

    }

    var save = function () {
        saveAssignment();
        toastr.success("Role assigned to user");
        window.location.href = '#/manageUserAccounts';
       
    }

    var loadAllUsers = function() {
        return users();
    }

    var loadAllRoles = function() {
        return roles();
    }


    var vm = {
        activate: activate,
        save: save,
        close: close,
        roleId: roleId,
        userId: userId,
        saveAssignment: saveAssignment,
        loadAllRoles: loadAllRoles,
        loadAllUsers: loadAllUsers



    };

    return vm;
});