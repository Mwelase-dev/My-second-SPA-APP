define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app', 'toastr'], function (dialog, ko, dtx, nl, app, toastr) {
    var excessModelToBeUpdated = ko.observable();
 
 
    var sections = ko.observableArray();
    var section = ko.observable();
    var activate = function () {
        var excess = localStorage.getItem('TheExcessObject');
        if (excess) excess = JSON.parse(excess);
        excessModelToBeUpdated(excess);
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }
     
    var close = function () {
        window.location.href = '#/manageExcesses';
    }
     
    var save = function () {
        return dtx.saveExcess(excessModelToBeUpdated()).then(function(result) {
            if (result) {
                toastr.success("Excess is updated");
                window.location.href = '#/manageExcesses';
            }
        });
    }

    
    var vm = {
        activate: activate,
        save: save,
        close: close,
        excessModelToBeUpdated  : excessModelToBeUpdated,
        
         
        section : section,
        
        sections: sections
    };

    return vm;
});










































/*
define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app'], function (dialog, ko, dtx, nl, app) {
    var excessModelToBeUpdated  = ko.observableArray();
    var sections                = ko.observableArray();
   

    var activate = function () {
        var excess = localStorage.getItem('TheRatingObject');
        if (excess) excess = JSON.parse(excess);
        excessModelToBeUpdated(excess);
        var test = excessModelToBeUpdated();
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
    //    excessModelToBeUpdated([
    //        {
    //            ratingId                : ratingId             ,
    //            section                 : section              ,
    //            ratingName              : ratingName           ,
    //            addRatingvalueUpto      : addRatingvalueUpto   ,
    //            ratingRandValue         : ratingRandValue      ,
    //            ratingPercentageValue   : ratingPercentageValue
    //        }
    //    ]);
    //    return excessModelToBeUpdated();
    //}


    //var loadCategories = function () {
    //    return sections();
    //}

    //var updateRating = function () {
    //    var data = {
    //        ratingId                : excessModelToBeUpdated().RatingId,
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
        excessModelToBeUpdated: excessModelToBeUpdated,

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