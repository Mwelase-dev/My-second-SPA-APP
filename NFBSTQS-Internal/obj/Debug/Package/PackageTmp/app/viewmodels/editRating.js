define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app', 'toastr'], function (dialog, ko, dtx, nl, app, toastr) {
    var ratingModelToBeUpdated  = ko.observable();
    var RatingName              = ko.observable("");
    var Threshold               = ko.observable("");
    var RatingPercentageValue   = ko.observable("");
    var RatingInRands           = ko.observable("");
    var sections                = ko.observableArray();
    var section                 = ko.observable();

    var activate = function () {
        var rating = localStorage.getItem('TheRatingObject');
        localStorage.removeItem('TheRatingObject');
        if (rating) rating = JSON.parse(rating);
        ratingModelToBeUpdated(rating);
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }
     
    var close = function () {
        window.location.href = '#/manageratings';
    }

    var save = function () {
        return dtx.updateRatingById(ratingModelToBeUpdated()).then(function(result) {
            toastr.success("Rating is updated");
            window.location.href = '#/manageratings';
        });
    }
    
    var vm = {
        activate: activate,
        save: save,
        close: close,
        ratingModelToBeUpdated  : ratingModelToBeUpdated,
        RatingName              : RatingName,
        Threshold: Threshold,
        RatingPercentageValue   : RatingPercentageValue,
        RatingInRands           : RatingInRands,
        section : section,
        sections: sections
    };

    return vm;
});










































/*
define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app'], function (dialog, ko, dtx, nl, app) {
    var ratingModelToBeUpdated  = ko.observableArray();
    var sections                = ko.observableArray();
   

    var activate = function () {
        var rating = localStorage.getItem('TheRatingObject');
        if (rating) rating = JSON.parse(rating);
        ratingModelToBeUpdated(rating);
        var test = ratingModelToBeUpdated();
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }
     
    var save = function () {
        return;
    }

    var close = function () {
        return;
    }

    //var section                 = ko.observable("");
    //var ratingName              = ko.observable("");
    //var addRatingvalueUpto      = ko.observable("");
    //var ratingRandValue         = ko.observable("");
    //var ratingPercentageValue   = ko.observable("");

    //var test = function() {
    //    ratingModelToBeUpdated([
    //        {
    //            ratingId                : ratingId             ,
    //            section                 : section              ,
    //            ratingName              : ratingName           ,
    //            addRatingvalueUpto      : addRatingvalueUpto   ,
    //            ratingRandValue         : ratingRandValue      ,
    //            ratingPercentageValue   : ratingPercentageValue
    //        }
    //    ]);
    //    return ratingModelToBeUpdated();
    //}


    //var loadCategories = function () {
    //    return sections();
    //}

    //var updateRating = function () {
    //    var data = {
    //        ratingId                : ratingModelToBeUpdated().RatingId,
    //        section                 : section(),
    //        ratingName              : ratingName(),
    //        addRatingvalueUpto      : addRatingvalueUpto(),
    //        ratingRandValue         : ratingRandValue(),
    //        ratingPercentageValue   : ratingPercentageValue()
    //    }
    //    dtx.updateRatingById(data);
    //}
    var vm = {
        activate: activate,
        save: save,
        close: close,
        ratingModelToBeUpdated: ratingModelToBeUpdated,

        //test: test,
        //updateRating: updateRating,
        //loadCategories: loadCategories,
        //section: section,
        //ratingName: ratingName,
        //addRatingvalueUpto: addRatingvalueUpto,
        //ratingRandValue: ratingRandValue,
        //ratingPercentageValue: ratingPercentageValue,
        


    };

    return vm;
});
*/