define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app','toastr'],
    function (dialog, ko, dtx, nl, app, toastr) {
        var sections = ko.observableArray();
        var ratingModel = ko.observableArray();
        var _section = ko.observable();

        var RatingDescription = ko.observable("");
        var Threshold = ko.observable("");
        var RatingPercentageValue = ko.observable("");
        
        var flatRate = ko.observable("");

        var save = function () {
            if (RatingDescription(), Threshold(), RatingPercentageValue(), flatRate()) {
                var data = {
                    sectionId: _section(),
                    RatingDescription: RatingDescription(),
                    Threshold: Threshold(),
                    RatingPercentageValue: RatingPercentageValue(),
                    RatingInRands: flatRate()
                }
               return dtx.addRating(data).then(function(result) {
                   if (result) {
                        toastr.success("Rating is saved");
                   window.location.href = '#/manageratings';
                   }
               });
               
            } else {
                toastr.warning("You cannot save null values");
            }
            
        }
         
        var activate = function() {
            return dtx.getSectionsForDropdown().then(function (result) {
                sections(result);
            });
        }
        
        var close = function () {
            return app.showMessage('Are you sure you want to cancel adding this rating', 'Leaving', ['Yes', 'No']).then(function (result) {
                if (result === "Yes") {
                    var form = document.getElementById("newRating");
                    form.reset();
                    history.back(1);
                }
            });
 
        };
        
        var vm = {
            ratingModel: ratingModel,
           
            activate: activate,
          
            save: save,
            close: close,
             
            _section: _section,
            RatingDescription: RatingDescription,
            Threshold: Threshold,
            RatingPercentageValue: RatingPercentageValue,
            sections: sections,
            flatRate: flatRate

           
        };
        return vm;
    });