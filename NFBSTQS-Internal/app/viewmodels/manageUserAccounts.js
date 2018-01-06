define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app', 'toastr'], function (dialog, ko, dtx, $, app, toastr) {
    var users = ko.observableArray();
    
    

    var removeUser = function (user) {
        if (users().length === 1 || user.RoleName === "Administrator") {
            toastr.warning("You cannot delete this account as it is the Administration account");
            window.location.href = '#/manageUserAccounts';
             
        } else {
             return app.showMessage('Are you sure you want remove this user', 'Removing', ['Yes', 'No']).then(function(result) {
                if (result === "Yes" & users().length != 1 & user.RoleName != "Administrator") {
                  return  dtx.deleteUser(user.UserId).then(function(resultIfdeleted) {
                      users.remove(user);
                      if (resultIfdeleted) {
                         
                      }
                  });
                }
            });
        }
    }

    var sendUserId = function (user) {
        var objectToSend = user.RoleId;
        var objectToSendUserId = user.UserId;
        localStorage.setItem('RoleId', objectToSend);
        localStorage.setItem('UserId', objectToSendUserId);
        window.location.href = '#/assignRole';
    }
    var manageUser = function(user) {
      
        var objectToSend = JSON.stringify(user);
        
        localStorage.setItem('TheUser', objectToSend);

        window.location.href = '#/manageUser';
    };

    function activate() {
        return dtx.getAllUsersForFrontEnd(users).then(function (result) {
            if (!result) {
                toastr.warning("Please log in to continue");
            }
        });
    }

    var vm = {
        activate: activate,
        users: users,
        removeUser: removeUser,
        sendUserId: sendUserId,
        manageUser: manageUser
    };

    return vm;
});