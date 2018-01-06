define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
    //observables for outer context bindings
    var sectionId = ko.observable();
    var clientName = ko.observable();
    var contactNumber = ko.observable();

    var selectedItem = ko.observable();
    var ItemDescription = ko.observable();
    var itemValue = ko.observable();
    var monthlyPremium = ko.observable();
    var annualPremium = ko.observable();
    //observables for outer context bindings

    var allFees = ko.observableArray();
    var allRatings = ko.observableArray();
    var allSections = ko.observableArray();
    var allLoadings = ko.observableArray();
    var allDiscounts = ko.observableArray();
    var quoteModel = ko.observableArray();

    var valueOfSelectedLoading = ko.observableArray();  //NB very important
    var valueOfSelectedDiscount = ko.observableArray(); //NB very important
    var valueOfRelevantRating = ko.observable();        //NB very important
    var ItemValue = ko.observable();                    //NB very important

    var items = [];
    var allItems = ko.observableArray();
    var itemToAdd = ko.observable("");

    var selectedLoadings = ko.observableArray();
    var selectedDiscounts = ko.observableArray();

    var totalMonthlyPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < allItems().length; i++) {
            total += allItems()[i].MonthlyPremium;
        }
        return total;
    });
    var totalAnnualPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < allItems().length; i++) {
            total += allItems()[i].AnnualPremium;
        }
        return total;

    });
    var deductions = ko.computed(function () {
        var result = ((eval(valueOfSelectedDiscount().join('+')) / 100) * valueOfRelevantRating());
        if (isNaN(result)) {
            result = 0;
        }
        return result;
    });
    var bonuses = ko.computed(function () {
        var result = (eval(valueOfSelectedLoading().join('+')) / 100) * valueOfRelevantRating();
        if (isNaN(result)) {
            result = 0;
        }
        return result;
    });
    var salary = ko.computed(function () {

    });
    var removeSelected = function (allItem) {
        return app.showMessage('Are you sure you want remove this quote', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                allItems.remove(allItem);
                for (var i = 0; i < items.length; i++) {
                    if (items[i] === allItem) {
                        items.splice(i, 1);
                        break;
                    }
                }
            }
        });
    };

    var sortItems = function () {
        allItems.sort();
    }

    var addItem2 = function () {

        var value = itemToAdd();



        if (value != "" && allItems.indexOf(value) < 0) { // Prevent blanks and duplicates
            allItems.push(value);
        }

        itemToAdd(""); // Clear the text box
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

    var monthlyPremiumCalcu = ko.computed(function () {//step3
        var result = valueOfRelevantRating() / 12;
        if (isNaN(result)) {
            result = 0;
        }
        return result;

    });

    var annualPremiumCalcu = ko.computed(function () {//step3a
        var result = valueOfRelevantRating();
        if (isNaN(result)) {
            result = 0;
        }
        return result;
    });

    var getCalcOfSelectedLoadingTimesItemValue = ko.computed(function () {//step4

        var result = valueOfRelevantRating() + (eval(valueOfSelectedLoading().join('+')) / 100) * valueOfRelevantRating();
        if (isNaN(result)) {
            result = 0;
        }
        return result;
    });

    var getCalcOfSelectedDiscountTimesItemValue = ko.computed(function () {//step6
        var result = (valueOfRelevantRating() - (eval(valueOfSelectedDiscount().join('+')) / 100) * valueOfRelevantRating());
        if (isNaN(result)) {
            result = 0;
        }
        return result;
    });

    var premiumSofar = ko.computed(function () {
        return valueOfRelevantRating() + getCalcOfSelectedLoadingTimesItemValue();
    });

    var getCalculationOfRatingTimesItemValue = ko.computed(function () {//step5
        return annualPremiumCalcu();
    });

    var checkRating = function () {//step1
        getRatingsToUseInCalculation();
        var test = valueOfRelevantRating();
        if (test != "") {
            toastr.success("found relevant rating");
        }
    };

    var addNewItemToExistingQuote = function () {

        var data = {
            ItemId: "",
            ItemDescription: "",
            ItemValue: 0,
            MonthlyPremium: 0,
            AnnualPremium: 0,
            SectionId: ""
        }
        selectedItem(data);
    }

    var activate = function () {
        loadSections();
        addquote();
        addNewItemToExistingQuote();
    }

    var addquote = function () {
        quoteModel([{
            sectionId: sectionId(),
            ClientName: clientName(),
            ContactNumber: contactNumber(),
            TotalMonthlyPremium: totalMonthlyPremium(),
            TotalAnnualPremium: totalAnnualPremium(),
            insuredItems: allItems()//items
        }]);
    };
     
    var removequote = function (quote) {
        return app.showMessage('Are you sure you want to cancel creating this quote', 'Delete', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                history.back(1);


                $('#txtItemDescription').val('');
                $('#txtItemValue').val('');
                $('#txtmonthlyPremium').val('');
                $('#txtgetCalcOfSelectedLoadingTimesItemValue').val('');
                $('#cmbsections').val(0);
                $('#ddlLoadings').val(0);
                $('#ddlDiscounts').val(0);
                $('#txtgetCalcOfSelectedDiscountTimesItemValue').val('');

                sectionId("");
                clientName("");
                contactNumber("");
                totalMonthlyPremium("");
                totalAnnualPremium("");
                ItemDescription("");
                itemValue("");
                monthlyPremium("");
                annualPremium("");
                allItems("");
                allSections("");
                allLoadings("");
            }
        });
    };

    var addItem = function () {
        var test = document.getElementById("ddlLoadings");

        var data = {
            ItemDescription : ItemDescription(),
            ItemValue       : ItemValue(),
            MonthlyPremium  : ((valueOfRelevantRating() + bonuses()) - deductions()) / 12,
            AnnualPremium   : ((valueOfRelevantRating() + bonuses()) - deductions()),//valueOfRelevantRating(),
            InsuredItemLoadings     : valueOfSelectedLoading(),
            InsuredItemDiscounts    : valueOfSelectedDiscount(),
       
        }
        if (selectedItem().LocalId === undefined) {
            var x = document.getElementById("cmbsections").value;
            data.SectionId = x;
            data.LocalId = guidLocalId();
           
            items.push(data);
            itemToAdd(data);
            addItem2();

            addquote();
            clearData();

        } else {
            for (var i = 0; i < allItems().length; i++) {
                if (allItems()[i].LocalId === selectedItem().LocalId) {
                    allItems.splice(i, 1, data);
                    selectedItem().LocalId = undefined;
                    clearData();
                    break;
                }
            }
        }

    };

    var clearData = function () {
        $('#txtItemDescription').val('');
        $('#txtItemValue').val(0);
        $('#txtmonthlyPremium').val(0);
        $('#txtgetCalcOfSelectedLoadingTimesItemValue').val(0);
        $('#ddlLoadings').val(0);
        $('#ddlDiscounts').val(0);
        $('#txtgetCalcOfSelectedDiscountTimesItemValue').val(0);
        $('#getCalcOfSelectedDiscountTimesItemValue').val(0);
        $('#txtAnnual').val(0);
        $('#cmbsections').val(0);
        document.getElementById("cmbsections").selectedIndex = "0";

        $('#txtgetCalcOfSelectedDiscountTimesItemValue').val(0);
      
        valueOfRelevantRating(0);
        valueOfSelectedLoading(0);
        valueOfSelectedDiscount(0);
        ItemValue(0);
        selectedItem("");
        addNewItemToExistingQuote();
    }

    var guidLocalId = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

    var removeItem = function (item) {
        $.each(quoteModel(), function () { this.insuredItems.remove(item) });
    };

    var save = function () {
        return app.showMessage('Are you sure you want to save this quote', 'Saving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {

                dtx.addQuote(quoteModel());
                toastr.success("Quote is created");
                var form = document.getElementById("newQuote");
                form.reset();

                allItems("");
                $('#cmbsections').val('');
                $('#ddlLoadings').val('');

                window.location.href = '#/dashboard';

            }
        });
    };

    var deactivate = function () {
        console.log('deactivate grid');
    };

    var close = function () {
        return app.showMessage('Are you sure you want to cancel creating this quote', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                var form = document.getElementById("newQuote");
                form.reset();

                history.back(1);
            }
        });
    };

    var getallSections = function () {
        return allSections();
    }

    var getallLoadings = function () {
        return allLoadings();
    };

    var getallDiscounts = function () {
        return allDiscounts();
    };

    var loadSections = function () {
        return dtx.getSections().then(function (result) {
            allSections(result);
            toastr.success("Sections Loaded");
            return dtx.getAllFeesForQuote().then(function (resultOfFees) {
                allFees(resultOfFees);
                toastr.success("Fees Loaded");
            });
        });
    }

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

    var getSelectedItem = function (allItem) {
        selectedItem(allItem);
        loadAllChildrenOfSection();
    }

    var testClick = function (data) {
        var test = data;
    }

    var testClick2 = function () {
        var x = document.getElementById("ddlLoadings");
        selectedLoadings.push(x);

        var test = selectedLoadings();
    }
      
    var vm = {

        activate: activate,
        quotes: quoteModel,
        addquote: addquote,
        removequote: removequote,
        addItem: addItem,
        removeItem: removeItem,
        save: save,
        deactivate: deactivate,
        close: close,
        allLoadings: getallLoadings,
        allDiscounts: getallDiscounts,
        getallSections: getallSections,
 
        loadSections: loadSections,
        valueOfSelectedLoading: valueOfSelectedLoading,
        valueOfSelectedDiscount: valueOfSelectedDiscount,
        ItemValue: ItemValue,
        monthlyPremiumCalcu: monthlyPremiumCalcu,
        annualPremiumCalcu: annualPremiumCalcu,
        getCalcOfSelectedLoadingTimesItemValue: getCalcOfSelectedLoadingTimesItemValue,
        getCalculationOfRatingTimesItemValue: getCalculationOfRatingTimesItemValue,
        getCalcOfSelectedDiscountTimesItemValue: getCalcOfSelectedDiscountTimesItemValue,
        loadAllChildrenOfSection: loadAllChildrenOfSection,
        getRatingsToUseInCalculation: getRatingsToUseInCalculation,
        checkRating: checkRating,
        valueOfRelevantRating: valueOfRelevantRating,
        premiumSofar: premiumSofar,

        sectionId: sectionId,
        clientName: clientName,
        contactNumber: contactNumber,
        totalMonthlyPremium: totalMonthlyPremium,
        totalAnnualPremium: totalAnnualPremium,

        ItemDescription: ItemDescription,
        itemValue: itemValue,
        monthlyPremium: monthlyPremium,
        annualPremium: annualPremium,

        itemToAdd: itemToAdd,
        allItems: allItems,

        addItem2: addItem2,
        sortItems: sortItems,
        removeSelected: removeSelected,
        items: items,
         
        salary: salary,
        bonuses: bonuses,
        deductions: deductions,
        selectedItem: selectedItem,
        getSelectedItem: getSelectedItem,
        testClick: testClick,
        testClick2: testClick2
    };
    return vm;
});