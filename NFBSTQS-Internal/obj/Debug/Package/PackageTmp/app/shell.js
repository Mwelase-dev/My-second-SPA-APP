define(['durandal/app', 'plugins/router', 'knockout', 'datacontext', 'bootstrap', 'toastr'], function (app, router, ko, dtx, bootstrap, toaster) {

    var loginCredentials = ko.observableArray();
    var loginFlag = ko.observable(false);
    var admin = ko.observable();
    var management = ko.observable();
    var underwriter = ko.observable();

    var userRoles = ko.observable();

    var username = ko.observable("");
    var password = ko.observable("");
    var userModel = ko.observable();

    var stillLoggedIn = ko.observable();

    var token = ko.observable("");

    function activate() {
        myRoute();
        preventHidingMenu();

        return;
    }

    var preventHidingMenu = function () {

        var item = sessionStorage.getItem("TheLoggeinUserDetails");

        var isman = sessionStorage.getItem("IsManager");
        var isund = sessionStorage.getItem("IsUnderWriter");
        var isadm = sessionStorage.getItem("IsAdmin");

        if (item) {
            stillLoggedIn(true);
            loginFlag(true);
            management(isman);
            underwriter(isund);
            admin(isadm);
        };
    };

    var myRoute = function () {
        return router.map([
            { route: ['', 'home'], moduleId: 'viewmodels/home', title: 'Home', nav: false, type: 'intro' },
            { route: 'dashboard', moduleId: 'viewmodels/dashboard', title: 'Dashboard', nav: true, type: 'intro' },
            { route: 'manageratings', moduleId: 'viewmodels/manageratings', title: 'Manage Rating', nav: false, type: 'intro' },
            { route: 'quotesfor', moduleId: 'viewmodels/subviews/quotesfor', title: 'Quote for', nav: false, type: 'intro' },
            { route: 'newSection', moduleId: 'viewmodels/newSection', title: 'New Section', nav: false, type: 'intro' },
            { route: 'newQuote', moduleId: 'viewmodels/newQuote', title: 'New Quote', nav: false, type: 'intro' },
            { route: 'manageUserAccounts', moduleId: 'viewmodels/manageUserAccounts', title: 'Manage User Accounts', nav: false, type: 'intro' },
            { route: 'manageCompulsoryFees', moduleId: 'viewmodels/manageCompulsoryFees', title: 'Manage Compulsory Fees', nav: false, type: 'intro' },
            { route: 'reports', moduleId: 'viewmodels/reports', title: 'Reports', nav: false, type: 'intro' },
            { route: 'newRating', moduleId: 'viewmodels/newRating', title: 'New Rating', nav: false, type: 'intro' },
            { route: 'newUser', moduleId: 'viewmodels/newUser', title: 'New User', nav: false, type: 'intro' },
            { route: 'newRole', moduleId: 'viewmodels/newRole', title: 'New Role', nav: false, type: 'intro' },
            { route: 'assignRole', moduleId: 'viewmodels/assignRole', title: 'Assign Role', nav: false, type: 'intro' },
            { route: 'editRating', moduleId: 'viewmodels/editRating', title: 'EditRating', nav: false, type: 'intro' },
            { route: 'newItem', moduleId: 'viewmodels/newItem', title: 'New item', nav: false, type: 'intro' },
            { route: 'editItem', moduleId: 'viewmodels/editItem', title: 'Edit item', nav: false, type: 'intro' },
            { route: 'myAccount', moduleId: 'viewmodels/myAccount', title: 'My account', nav: true, type: 'intro' },
            { route: 'newFee', moduleId: 'viewmodels/newFee', title: 'New Fee', nav: false, type: 'intro' },
            { route: 'editFee', moduleId: 'viewmodels/editFee', title: 'Edit Fee', nav: false, type: 'intro' },
            { route: 'editQuote', moduleId: 'viewmodels/editQuote', title: 'Edit Quote', nav: false, type: 'intro' },
            { route: 'reports', moduleId: 'viewmodels/reports', title: 'Quote Report', nav: false, type: 'intro' },
            { route: 'quote', moduleId: 'viewmodels/quote', title: 'Quote', nav: false, type: 'intro' },
            { route: 'test', moduleId: 'viewmodels/test', title: 'testc', nav: false, type: 'intro' },
            { route: 'newWarranty', moduleId: 'viewmodels/newWarranty', title: 'New Warranty', nav: false, type: 'intro' },
             { route: 'manageWarranties', moduleId: 'viewmodels/manageWarranties', title: 'Manage Waranties', nav: false, type: 'intro' },
                { route: 'editWarranty', moduleId: 'viewmodels/editWarranty', title: 'Edit Waranties', nav: false, type: 'intro' },
                 { route: 'manageSections', moduleId: 'viewmodels/manageSections', title: 'Manage Sections', nav: false, type: 'intro' },
                 { route: 'warrantyPopUp', moduleId: 'viewmodels/warrantyPopUp', title: 'Add Waranties To Quote', nav: false, type: 'intro' },
                 { route: 'addnewSection', moduleId: 'viewmodels/addnewSection', title: 'Add New Section', nav: false, type: 'intro' },
                 { route: 'manageUser', moduleId: 'viewmodels/manageUser', title: 'Manage User', nav: false, type: 'intro' },
                  { route: 'manageExcesses', moduleId: 'viewmodels/manageExcesses', title: 'Manage Excesses', nav: false, type: 'intro' },
 { route: 'newExcess', moduleId: 'viewmodels/newExcess', title: 'New Excess', nav: false, type: 'intro' },
 { route: 'editExcess', moduleId: 'viewmodels/editExcess', title: 'Edit Excess', nav: false, type: 'intro' },

     { route: 'manageCommisions', moduleId: 'viewmodels/manageCommisions', title: 'Manage Commisions', nav: false, type: 'intro' },
 { route: 'newCommision', moduleId: 'viewmodels/newCommision', title: 'New Commision', nav: false, type: 'intro' },
 { route: 'editCommision', moduleId: 'viewmodels/editCommision', title: 'Edit Commision', nav: false, type: 'intro' },
  { route: 'getReports', moduleId: 'viewmodels/getReports', title: 'Get Reports', nav: false, type: 'intro' },
 



        ]).buildNavigationModel()
            .mapUnknownRoutes('#', 'not-found')
            .activate();
    };

    var clickLogin = function () {
        $("#btnlogin").click(function () {
            loginFlag(true);
        });
        //var test = dtx.loggedin();
    };

    var login = function () {
        //if (user.hasError() === true) {
        //    return false;
        //}
        //return dtx.login(user.username(), user.password(), buildNav).then(function () {
        //    //user.reset();
        //    return true;
        //});
    };

    var logout = function () {
        username('');
        password('');
        localStorage.removeItem("TheLoggeinUserDetails");
        sessionStorage.removeItem("TheLoggeinUserDetails");
        loginFlag(false);
        stillLoggedIn(false);
        window.location.href = '#/home';
    };

    var authenticate = function () {
        var data = {
            UserName: username(),
            Password: password()
        }
        return dtx.verifyLoginCredentials(token, data).then(function () {
            if (token != null) {
                sessionStorage.setItem('UserAuthToken', token().Token);
                return dtx.getUserModel(userModel, data, token().Token).then(function (result) {
                    if (userModel().UserName != null) {
                        getUserRoles();
                        window.location.href = '#/dashboard';
                        toaster.success("Successfully Logged in");
                        toaster.success("Welcome to dashboard");
                        username('');
                        password('');
                        loginFlag(true);
                        var objectToSend = JSON.stringify(userModel());
                        localStorage.setItem('TheLoggeinUserDetails', objectToSend);
                        sessionStorage.setItem("TheLoggeinUserDetails", objectToSend);
                        stillLoggedIn(true);

                    }
                });
            } else {
                username('');
                password('');
                loginFlag(false);
                toaster.error("Login Failed, \n Wrong combination of password and username");
            }
        });

    };

    var getUserRoles = function () {
        return dtx.getCurrentUserRoles(userRoles, userModel().RoleId).then(function (result) {
            userRoles(result);
            setUserRoles();
        });
    };

    var isUserInRole = function (role) {

        //return $.inArray(role, userRoles()[0].RoleName) > -1;
        for (var i = 0; i < userRoles().length; i++) {
            if (role === userRoles()[i].RoleName) {
                return true;
            } else {
                return false;
            }
        }
    };

    var setUserRoles = function () {
        if (userRoles().length < 1)
            return;


        management(isUserInRole("Management"));
        underwriter(isUserInRole("Underwriter"));
        admin(isUserInRole("Administrator"));

        sessionStorage.setItem('IsManager', management());
        sessionStorage.setItem('IsUnderWriter', underwriter());
        sessionStorage.setItem('IsAdmin', admin());

    };

    var vm = {
        activate: activate,
        router: router,

        login: login,
        logout: logout,
        loggedin: dtx.loggedin,
        loginFlag: loginFlag,
        clickLogin: clickLogin,

        username: username,
        password: password,
        authenticate: authenticate,
        management: management,
        admin: admin,
        underwriter: underwriter,
        stillLoggedIn: stillLoggedIn

    };
    return vm;
});