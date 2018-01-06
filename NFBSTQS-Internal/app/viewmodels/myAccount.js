define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app', 'toastr'], function (dialog, ko, dtx, $, app, toastr) {
    var FirstName = ko.observable("");
    var LastName = ko.observable("");
    var UserName = ko.observable("");
    var Password = ko.observable("");
    var NewPassword = ko.observable("");
    var ConfirmPassword = ko.observable("");
    var OldPassword = ko.observable("");
    var userModel = ko.observable("");
    var passwordsMatch = ko.observable(false);

    var chaeckIfPasswordsMatch = function () {
        if ($("#txtnewpass").val() === $("#txtconfirmnewpass").val()) {
            passwordsMatch(true);
        }
    }
     
    var userModelToBeUpdated = ko.observableArray();
     
    function activate() {
        var userDetails = localStorage.getItem('TheLoggeinUserDetails');
        if (userDetails) userDetails = JSON.parse(userDetails);
        userModelToBeUpdated(userDetails);
    }
 
    var save = function () {
        if ($("#txtnewpass").val() === $("#txtconfirmnewpass").val()) {
            if ($("#txtconfirmnewpass") != null) {
               
                var data = {
                    UserName: userModelToBeUpdated().UserName,
                    Password: OldPassword()
                }

                return dtx.verifyLoginCredentials(userModel, data).then(function (result) {
                    if (result != null) {
                        return dtx.updateUserAccountByUserId(userModelToBeUpdated()).then(function (secondResult) {
                            if (secondResult) {
                                toastr.success("Password change successful");
                                location.href = '#/dashboard';
                            } else {
                                toastr.error("Password is not updated");
                                NewPassword("");
                                OldPassword("");
                                ConfirmPassword("");
                            }
                        });
                    } else {
                        toastr.error("Old Password is not valid");
                        NewPassword("");
                        OldPassword("");
                        location.href = '#/dashboard';
                    }
                });
             
            } else {
                toastr.warning("Cannot save");
            }
            
        } else {
            toastr.warning("Passwords do no match");
        }
    }

    var close = function () {
        window.location.href = '#/dashboard';
    }

    var checkPasswordMatch = function () {
        var password = $("#txtnewpass").val();
        var confirmPassword = $("#txtconfirmnewpass").val();

        if (password != confirmPassword) {
            toastr.error("Passwords do not match!");
        } else {
            toastr.success("Passwords match.");
        }
          
    }
     
    $(document).ready(function () {
        $("#txtconfirmnewpass").keyup(checkPasswordMatch);
    });
     
    var vm = {
        activate: activate,

        FirstName: FirstName,
        LastName: LastName,
        UserName: UserName,
        Password: Password,
        NewPassword: NewPassword,
        ConfirmPassword: ConfirmPassword,
        OldPassword: OldPassword,
       
        save: save,
        close: close,
        userModelToBeUpdated: userModelToBeUpdated,
        checkPasswordMatch: checkPasswordMatch,
        chaeckIfPasswordsMatch: chaeckIfPasswordsMatch,
        passwordsMatch: passwordsMatch,

    };

    return vm;
});