define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
  
    var CommisionDescription = ko.observable();
    var CommisionValue = ko.observable();
     
     
    var activate = function () {
         
    }
 
    var save = function () {
        if (CommisionDescription()) {
            
            var data = {
                CommisionValue: CommisionValue(),
                CommisionDescription: CommisionDescription() 
            }
            return dtx.saveCommision(data).then(function (result) {
                if (result) {
                    var form = document.getElementById("newCommision");
                    form.reset();
                    toastr.success("Commision is saved");
                    window.location.href = '#/manageCommisions';
                }
           });
        } else {
            toastr.warning("You cannot save null values");
        }
    }

    var close = function () {
        return app.showMessage('Are you sure you want to cancel creating this commision', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                var form = document.getElementById("newCommision");
                form.reset();
                window.location.href = '#/manageCommisions';
            }
        });
    };

    var vm = {
        activate: activate,
    
        save: save,
        close: close,
        CommisionDescription: CommisionDescription,
    
        CommisionValue: CommisionValue,
     
    };

    return vm;
});