define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app', 'toastr'], function (dialog, ko, dtx, nl, app, toastr) {
    var commisionModelToBeUpdated = ko.observable();
 
 
    var sections = ko.observableArray();
    var section = ko.observable();
    var activate = function () {
        var commision = localStorage.getItem('TheCommisionObject');
        if (commision) commision = JSON.parse(commision);
        commisionModelToBeUpdated(commision);
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }
     
    var close = function () {
        window.location.href = '#/manageCommisions';
    }
     
    var save = function () {
        return dtx.saveCommision(commisionModelToBeUpdated()).then(function(result) {
            if (result) {
                toastr.success("Commision is updated");
                window.location.href = '#/manageCommisions';
            }
        });
    }

    
    var vm = {
        activate: activate,
        save: save,
        close: close,
        commisionModelToBeUpdated  : commisionModelToBeUpdated,
        
         
        section : section,
        
        sections: sections
    };

    return vm;
});










































/*
define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app'], function (dialog, ko, dtx, nl, app) {
    var commisionModelToBeUpdated  = ko.observableArray();
    var sections                = ko.observableArray();
   

    var activate = function () {
        var commision = localStorage.getItem('TheRatingObject');
        if (commision) commision = JSON.parse(commision);
        commisionModelToBeUpdated(commision);
        var test = commisionModelToBeUpdated();
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
    //    commisionModelToBeUpdated([
    //        {
    //            ratingId                : ratingId             ,
    //            section                 : section              ,
    //            ratingName              : ratingName           ,
    //            addRatingvalueUpto      : addRatingvalueUpto   ,
    //            ratingRandValue         : ratingRandValue      ,
    //            ratingPercentageValue   : ratingPercentageValue
    //        }
    //    ]);
    //    return commisionModelToBeUpdated();
    //}


    //var loadCategories = function () {
    //    return sections();
    //}

    //var updateRating = function () {
    //    var data = {
    //        ratingId                : commisionModelToBeUpdated().RatingId,
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
        commisionModelToBeUpdated: commisionModelToBeUpdated,

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