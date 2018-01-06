define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app', 'toastr'], function (dialog, ko, dtx, $, app, toastr) {
    var lastSavedJson = ko.observable("");
    var sectionModel = ko.observableArray();

    var sectionName = ko.observable();
    var loadings    = ko.observableArray();
    var discounts   = ko.observableArray();
    var ratings     = ko.observableArray();
     
    var selectedRating  = ko.observable();
    var selectedDiscount= ko.observable();
    var selectedLoading = ko.observable();

    var allRatings = ko.observableArray();
    var allDiscounts = ko.observableArray();
    var allLoadings = ko.observableArray();

    //properties
    var RatingDescription       = ko.observable();
    var Threshold               = ko.observable();
    var RatingPercentageValue   = ko.observable();
    var RatingInRands           = ko.observable();

    var LoadingDescription      = ko.observable();
    var LoadingRate             = ko.observable();

    var DiscountDescription     = ko.observable();
    var DiscountRate            = ko.observable();
    //properties

    var getSelectedRating = function(allRating) {
        selectedRating(allRating);
    }
    var getSelectedDiscount = function (allDiscount) {
        selectedDiscount(allDiscount);
    }
    var getSelectedLoading = function (allLoading) {
        selectedLoading(allLoading);
    }

    var removeSelectedRating = function (allRating) {
        return app.showMessage('Are you sure you want remove this rating', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                allRatings.remove(allRating);
                addNewRatings();
            }
        });
    }
    var removeSelectedDiscount = function (allDiscount) {
        return app.showMessage('Are you sure you want remove this discount', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                allDiscounts.remove(allDiscount);
                addNewDiscount();
            }
        });
    }
    var removeSelectedLoading = function (allLoading) {
        return app.showMessage('Are you sure you want remove this loading', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                allLoadings.remove(allLoading);
                addNewLoading();
            }
        });
    }
 

    var addNewRatings = function() {
        var data = {
            RatingDescription: "",
            Threshold: "",
            RatingPercentageValue: "",
            RatingInRands: ""
        };
        selectedRating(data);
    };
    var addNewLoading = function () {
        var data = {
            LoadingDescription: "",
            LoadingRate: ""
        };
        selectedLoading(data);
    };
    var addNewDiscount = function () {
        var data = {
            DiscountDescription: "",
            DiscountRate: ""
        };
        selectedDiscount(data);
    };

    var guidLocalId = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

    var addSection = function () {
        sectionModel([{
            sectionName : sectionName(),
            loadings    : allLoadings(),
            discounts   : allDiscounts(),
            ratings     : allRatings()
        }]);
    }

    var removeSection = function (section) {
        sectionModel.remove(section);
    };
     
    var addLoading = function () {
        var data = {
            LoadingDescription  : selectedLoading().LoadingDescription,
            LoadingRate: selectedLoading().LoadingRate
        };
        if (selectedLoading().LocalId === undefined) {
            data.LocalId = guidLocalId();

            if (data.LoadingDescription != null && allLoadings.indexOf(data) < 0) { // Prevent blanks and duplicates
                allLoadings.push(data);
                addNewLoading();
            }
        } else {
            for (var i = 0; i < allLoadings().length; i++) {
                if (allLoadings()[i].LocalId === selectedLoading().LocalId) {
                    data.LocalId = selectedLoading().LocalId;
                    allLoadings.splice(i, 1, data);
                    addNewLoading();
                    break;
                }
            }
        }
    };

    var addDiscount = function () {
        var data = {
            DiscountDescription: selectedDiscount().DiscountDescription,
            DiscountRate: selectedDiscount().DiscountRate
        };
        if (selectedDiscount().LocalId === undefined) {
            data.LocalId = guidLocalId();

            if (data.DiscountDescription != null && allDiscounts.indexOf(data) < 0) { // Prevent blanks and duplicates
                allDiscounts.push(data);
                addNewDiscount();
            }
        } else {
            for (var i = 0; i < allDiscounts().length; i++) {
                if (allDiscounts()[i].LocalId === selectedDiscount().LocalId) {
                    data.LocalId = selectedDiscount().LocalId;
                    allDiscounts.splice(i, 1, data);
                    addNewDiscount();
                    break;
                }
            }
        }
    };

     var addRatings = function () {
        var data = {
            RatingDescription       : selectedRating().RatingDescription,
            Threshold               : selectedRating().Threshold,
            RatingPercentageValue   : selectedRating().RatingPercentageValue,
            RatingInRands           : selectedRating().RatingInRands 
        };

         if (selectedRating().LocalId === undefined) {
             data.LocalId = guidLocalId();

             if (data.RatingDescription != null && allRatings.indexOf(data) < 0) { // Prevent blanks and duplicates
                 allRatings.push(data);
                 addNewRatings();
             }
         } else {
             for (var i = 0; i < allRatings().length; i++) {
                 if (allRatings()[i].LocalId === selectedRating().LocalId) {
                     data.LocalId = selectedRating().LocalId;
                     allRatings.splice(i, 1, data);
                     
                     addNewRatings();
                     break;
                 }
             }
         }
  
    };

    var removeDiscount = function (discounts) {
        $.each(sectionModel(), function () { this.discounts.remove(discounts) });
    };

    var removeLoading = function (loadings) {
        $.each(sectionModel(), function () { this.loadings.remove(loadings) });
    };
   
    var removeRating = function (rating) {
        $.each(sectionModel(), function () { this.ratings.remove(rating) });
    };
 
    var save = function () {
        addSection();
        dtx.addSections(sectionModel());
        var form = document.getElementById("newSection");
        form.reset();
        addSection();
        addNewRatings();
        addNewLoading();
        addNewDiscount();
        toastr.success("Section is saved");
        window.location.href = '#/manageratings';
    };
 
    var close = function () {
        return app.showMessage('Are you sure you want to cancel adding new section?', 'Leaving', ['Yes', 'No']).then(function(result) {
            if (result === "Yes") {
                var form = document.getElementById("newSection");
                form.reset();
                history.back(1);
            }
        });
    };

    var activate = function() {
        addSection();
        addNewRatings();
        addNewLoading();
        addNewDiscount();
    }

    var vm = {
        activate : activate,
        sections : sectionModel,
        lastSavedJson: lastSavedJson,
        addSection: addSection,
        removeSection: removeSection,
     
 
        save: save,
        close: close,
        addRatings: addRatings,
        removeRating: removeRating,
        addLoading: addLoading,
        addDiscount: addDiscount,
        removeDiscount: removeDiscount,
        removeLoading: removeLoading,
        sectionName : sectionName,
        ratings: ratings,
        loadings : loadings ,
        discounts: discounts,

        selectedRating  : selectedRating,
        selectedDiscount: selectedDiscount,
        selectedLoading: selectedLoading,

        allRatings      : allRatings,
        allDiscounts    : allDiscounts,
        allLoadings     : allLoadings,
                  
        RatingDescription    : RatingDescription    ,
        Threshold            : Threshold            ,
        RatingPercentageValue: RatingPercentageValue,
        RatingInRands        : RatingInRands        ,
                                        
        LoadingDescription   : LoadingDescription   ,
        LoadingRate          : LoadingRate          ,
                                                
        DiscountDescription  : DiscountDescription,
        DiscountRate: DiscountRate,

        getSelectedRating: getSelectedRating,
        getSelectedDiscount : getSelectedDiscount,
        getSelectedLoading: getSelectedLoading,

        removeSelectedRating : removeSelectedRating,
        removeSelectedDiscount: removeSelectedDiscount,
        removeSelectedLoading: removeSelectedLoading,

        addNewRatings: addNewRatings,
        addNewLoading: addNewLoading,
        addNewDiscount: addNewDiscount
 

    }
    return vm;
});
 