define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app'], function (dialog, ko, dtx, nl, app) {
    var insuredItemModelToBeUpdated = ko.observable();
    var ItemDescription = ko.observable("");
    var ItemValue = ko.observable("");
    var MonthlyPremium = ko.observable("");
    var AnnualPremium = ko.observable("");
    
    var activate = function () {
        var item = localStorage.getItem('TheInsuredItemObject');
        if (item) item = JSON.parse(item);
        insuredItemModelToBeUpdated(item);
        var test = insuredItemModelToBeUpdated();
    }
      
    var close = function () {
        window.location.href = '#/quotesfor';
    }


    var updatingRating = function () {
        dtx.updateItemById(insuredItemModelToBeUpdated());
    };

    var save = function () {
        
        updatingRating();
        app.showMessage('Item is updated', 'Update success', ['Ok']);
        window.location.href = '#/quotesfor';
    }

    
    var vm = {
        activate: activate,
        save: save,
        close: close,
        insuredItemModelToBeUpdated  : insuredItemModelToBeUpdated,
        ItemDescription              : ItemDescription,
        ItemValue: ItemValue,
        MonthlyPremium: MonthlyPremium,

        AnnualPremium : AnnualPremium,
        updatingRating: updatingRating
    };

    return vm;
});










































/*
define(['plugins/dialog', 'knockout', 'services/datacontext', 'viewModels/newLoading', 'durandal/app'], function (dialog, ko, dtx, nl, app) {
    var insuredItemModelToBeUpdated  = ko.observableArray();
    var sections                = ko.observableArray();
   

    var activate = function () {
        var rating = localStorage.getItem('TheRatingObject');
        if (rating) rating = JSON.parse(rating);
        insuredItemModelToBeUpdated(rating);
        var test = insuredItemModelToBeUpdated();
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
    //    insuredItemModelToBeUpdated([
    //        {
    //            ratingId                : ratingId             ,
    //            section                 : section              ,
    //            ratingName              : ratingName           ,
    //            addRatingvalueUpto      : addRatingvalueUpto   ,
    //            ratingRandValue         : ratingRandValue      ,
    //            ratingPercentageValue   : ratingPercentageValue
    //        }
    //    ]);
    //    return insuredItemModelToBeUpdated();
    //}


    //var loadCategories = function () {
    //    return sections();
    //}

    //var updateRating = function () {
    //    var data = {
    //        ratingId                : insuredItemModelToBeUpdated().RatingId,
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
        insuredItemModelToBeUpdated: insuredItemModelToBeUpdated,

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