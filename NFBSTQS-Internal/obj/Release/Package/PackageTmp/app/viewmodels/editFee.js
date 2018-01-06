define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app', 'toastr'], function (dialog, ko, dtx, nl, app, toastr) {
    var feeModelToBeUpdated = ko.observable();
    var FeeDescription = ko.observable("");
    var FeeValue = ko.observable("");
    var FeePercantage = ko.observable("");


    var activate = function () {
        var fee = localStorage.getItem('TheFeeObject');
        if (fee) fee = JSON.parse(fee);
        feeModelToBeUpdated(fee);
        var test = feeModelToBeUpdated();
    }

    var close = function () {
        return app.showMessage('Are you sure you want cancel editing this fee', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                window.location.href = '#/manageCompulsoryFees';
            }
        });

    }


    var updatingFee = function () {

    };

    var save = function () {
        return dtx.updateFeeById(feeModelToBeUpdated()).then(function (result) {
            if (result) {
                toastr.success("Fee is updated");
                window.location.href = '#/manageCompulsoryFees';
            }
        });
    }


    var vm = {
        activate: activate,
        save: save,
        close: close,
        feeModelToBeUpdated: feeModelToBeUpdated,

        FeeDescription: FeeDescription,
        FeeValue: FeeValue,
        FeePercantage: FeePercantage

    };

    return vm;
});










































/*
define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app'], function (dialog, ko, dtx, nl, app) {
    var feeModelToBeUpdated  = ko.observableArray();
    var sections                = ko.observableArray();
   

    var activate = function () {
        var rating = localStorage.getItem('TheRatingObject');
        if (rating) rating = JSON.parse(rating);
        feeModelToBeUpdated(rating);
        var test = feeModelToBeUpdated();
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
    //    feeModelToBeUpdated([
    //        {
    //            ratingId                : ratingId             ,
    //            section                 : section              ,
    //            ratingName              : ratingName           ,
    //            addRatingvalueUpto      : addRatingvalueUpto   ,
    //            ratingRandValue         : ratingRandValue      ,
    //            ratingPercentageValue   : ratingPercentageValue
    //        }
    //    ]);
    //    return feeModelToBeUpdated();
    //}


    //var loadCategories = function () {
    //    return sections();
    //}

    //var updateRating = function () {
    //    var data = {
    //        ratingId                : feeModelToBeUpdated().RatingId,
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
        feeModelToBeUpdated: feeModelToBeUpdated,

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