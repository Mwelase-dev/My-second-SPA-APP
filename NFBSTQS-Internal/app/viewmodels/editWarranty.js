define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app', 'toastr'], function (dialog, ko, dtx, nl, app, toastr) {
    var warrantyModelToBeUpdated = ko.observable();
 
 
    var sections = ko.observableArray();
    var section = ko.observable()
    var activate = function () {
        var rating = localStorage.getItem('TheWarrantyObject');
        if (rating) rating = JSON.parse(rating);
        warrantyModelToBeUpdated(rating);
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }
     
    var close = function () {
        window.location.href = '#/manageWarranties';
    }
     
    var save = function () {
        return dtx.updateWarrantyById(warrantyModelToBeUpdated()).then(function(result) {
            if (result) {
                toastr.success("Warranty is updated");
                window.location.href = '#/manageWarranties';
            }
        });
    }

    
    var vm = {
        activate: activate,
        save: save,
        close: close,
        warrantyModelToBeUpdated  : warrantyModelToBeUpdated,
        
         
        section : section,
        
        sections: sections
    };

    return vm;
});










































/*
define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app'], function (dialog, ko, dtx, nl, app) {
    var warrantyModelToBeUpdated  = ko.observableArray();
    var sections                = ko.observableArray();
   

    var activate = function () {
        var rating = localStorage.getItem('TheRatingObject');
        if (rating) rating = JSON.parse(rating);
        warrantyModelToBeUpdated(rating);
        var test = warrantyModelToBeUpdated();
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
    //    warrantyModelToBeUpdated([
    //        {
    //            ratingId                : ratingId             ,
    //            section                 : section              ,
    //            ratingName              : ratingName           ,
    //            addRatingvalueUpto      : addRatingvalueUpto   ,
    //            ratingRandValue         : ratingRandValue      ,
    //            ratingPercentageValue   : ratingPercentageValue
    //        }
    //    ]);
    //    return warrantyModelToBeUpdated();
    //}


    //var loadCategories = function () {
    //    return sections();
    //}

    //var updateRating = function () {
    //    var data = {
    //        ratingId                : warrantyModelToBeUpdated().RatingId,
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
        warrantyModelToBeUpdated: warrantyModelToBeUpdated,

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