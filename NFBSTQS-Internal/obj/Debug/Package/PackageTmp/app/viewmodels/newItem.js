define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
    var sections = ko.observableArray();

    var allRatings = ko.observableArray();
    var allLoadings = ko.observableArray();
    var allDiscounts = ko.observableArray();
     
    var valueOfSelectedLoading = ko.observableArray();  //NB very important
    var valueOfSelectedDiscount = ko.observableArray(); //NB very important
    var valueOfRelevantRating = ko.observable();        //NB very important

    var theQuote = ko.observable();
    var newItemModel = ko.observableArray();

    var ItemDescription = ko.observable("");
    var ItemValue       = ko.observable("");
    var MonthlyPremium  = ko.observable("");
    var AnnualPremium = ko.observable("");
    var SectionId = ko.observable("");
     
    var load = function () {
        return sections();
    };
     
    var close = function () {
        window.location.href = '#/quotesfor';
        return;
    };

    var getSections = function () {
        return dtx.getSectionsForDropdown().then(function (result) {
            sections(result);
        });
    }

    var getParentQuote = function() {
        var quote = localStorage.getItem('TheQuoteObject');
        if (quote) quote = JSON.parse(quote);
        theQuote(quote);
        var test = theQuote();
    }

    var monthlyPremiumCalcu = ko.computed(function () {//step3
        return valueOfRelevantRating() / 12;
    });

    var annualPremiumCalcu = ko.computed(function () {//step3a
        return valueOfRelevantRating();
    });

    var getCalcOfSelectedLoadingTimesItemValue = ko.computed(function () {//step4
        return (valueOfRelevantRating() + ((eval(valueOfSelectedLoading().join('+')) / 100) * valueOfRelevantRating()));
    });

    var getCalcOfSelectedDiscountTimesItemValue = ko.computed(function () {//step6
        return (valueOfRelevantRating() - ((eval(valueOfSelectedDiscount().join('+')) / 100) * valueOfRelevantRating()));
    });

    var addNewItem = function() {
        var data = {
            ClientId            : theQuote().ClientId,
            QuoteId             : theQuote().QuoteId,
            SectionId           : SectionId(),
            ItemDescription     : ItemDescription(),
            ItemValue           : ItemValue(),      
            MonthlyPremium      : monthlyPremiumCalcu(),
            AnnualPremium       : valueOfRelevantRating()
        }
        dtx.addItemToExistingQuote(data);
    }

    var save = function () {
        addNewItem();
        toastr.success("Item is saved");
        window.location.href = '#/dashboard';
    };

    var loadAllChildrenOfSection = function () {
        var x = document.getElementById("cmbsections").value;
        return dtx.getRatings(x).then(function (result) {
            allRatings(result);
            toastr.success("Found Ratings");
            var testRatings = allRatings();
            return dtx.getDiscounts(x).then(function (secondResult) {
                allDiscounts(secondResult);
                var test2 = allDiscounts();
                toastr.success("Found Loadings");
                return dtx.getLoadings(x).then(function (thirdResult) {
                    allLoadings(thirdResult);
                    var test3 = allLoadings();
                    toastr.success("Found Discounts");
                });
            });
        });
    }

    var getRatingsToUseInCalculation = function () {//step2
        var subtotal = 0;
        var test = allRatings();
        var difference = 0;
        for (var i = 0; i < allRatings().length; i++) {
            var test2 = allRatings()[i].RatingPercentageValue * allRatings()[i].Threshold;
            if (ItemValue() < allRatings()[i].Threshold) {
                if (difference === 0) {
                    subtotal = (ItemValue() * allRatings()[i].RatingPercentageValue);
                    i = allRatings().length;
                } else {
                    subtotal += (difference * allRatings()[i].RatingPercentageValue);
                    i = allRatings().length;
                }
            } else if (ItemValue() >= allRatings()[i].Threshold) {
                if (i === 0) {
                    subtotal += (allRatings()[i].Threshold * allRatings()[i].RatingPercentageValue);
                    difference = ItemValue() - allRatings()[i].Threshold;
                } else {
                    subtotal += ((allRatings()[i].Threshold - allRatings()[i - 1].Threshold) * allRatings()[i].RatingPercentageValue);
                    difference = ItemValue() - allRatings()[i].Threshold;
                }
            } else {
                subtotal += (difference * allRatings()[i].RatingPercentageValue);
            }
        }
        valueOfRelevantRating(subtotal);
    };

    var checkRating = function () {//step1
        getRatingsToUseInCalculation();
        var test = valueOfRelevantRating();
        if (test != "") {
            toastr.success("found relevant rating");
        }
    };

    var getallLoadings = function () {
        return allLoadings();
    };

    var getallDiscounts = function () {
        return allDiscounts();
    };

    var activate = function () {
        getSections();
        getParentQuote();
    }
     
    var vm = {
        valueOfRelevantRating: valueOfRelevantRating,
        valueOfSelectedLoading: valueOfSelectedLoading,
        valueOfSelectedDiscount: valueOfSelectedDiscount,
        monthlyPremiumCalcu: monthlyPremiumCalcu,
        annualPremiumCalcu: annualPremiumCalcu,
        getCalcOfSelectedLoadingTimesItemValue: getCalcOfSelectedLoadingTimesItemValue,
        getCalcOfSelectedDiscountTimesItemValue: getCalcOfSelectedDiscountTimesItemValue,
        allLoadings: getallLoadings,
        allDiscounts: getallDiscounts,
        checkRating : checkRating,
        activate: activate,
        load: load,
        close: close,
        save: save,
        getSections: getSections,
        getParentQuote: getParentQuote,
        addNewItem: addNewItem,


        ItemDescription : ItemDescription,
        ItemValue       : ItemValue      ,
        MonthlyPremium  : MonthlyPremium ,
        AnnualPremium   : AnnualPremium ,
        SectionId: SectionId,
        loadAllChildrenOfSection: loadAllChildrenOfSection

    };
    return vm;
});