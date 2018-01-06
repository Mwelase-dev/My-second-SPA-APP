define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
    //observables for outer context bindings
    var sectionId = ko.observable();
    var clientName = ko.observable();
    var contactNumber = ko.observable();
    var allWarranties = ko.observableArray();
    var Comments = ko.observable();
    var selectedItem = ko.observable();
    //var ItemDescription = ko.observable();
    var itemValue = ko.observable();
    var monthlyPremium = ko.observable();
    var annualPremium = ko.observable();
    //observables for outer context bindings

    var allFees = ko.observableArray();
    var allRatings = ko.observableArray();
    var allSections = ko.observableArray();
    var QuoteWarranties = ko.observableArray();
   
    var quoteModel = ko.observableArray();

    var allLoadings = ko.observableArray();
    var selectedLoadings = ko.observableArray();
    var selectedWarranties = ko.observableArray();
    var valueOfSelectedLoading = ko.observableArray();  //NB very important
     
    var allDiscounts = ko.observableArray();
    var selectedDiscounts = ko.observableArray();
    var valueOfSelectedDiscount = ko.observableArray(); //NB very important
     
    var valueOfRelevantRating = ko.observable();        //NB very important
    var ItemValue = ko.observable();                    //NB very important

    var items = [];
    var allItems = ko.observableArray();
    var itemToAdd = ko.observable("");
     
    var totalMonthlyPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < allItems().length; i++) {
            total += allItems()[i].MonthlyPremium;
        }
       
        return formatCurrency(total);
    });
    var totalAnnualPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < allItems().length; i++) {
            total += allItems()[i].AnnualPremium;
        }
       
        return formatCurrency(total);

    });
    var deductions = ko.computed(function () {
        if (valueOfSelectedDiscount().length > 0) {
            var result = ((eval(valueOfSelectedDiscount().join('+')) / 100) * valueOfRelevantRating());
        
        if (isNaN(result)) {
            result = 0;
        }
        return result;
        }
        return 0;
    });

    var bonuses = ko.computed(function () {
        if (valueOfSelectedLoading().length > 0) {
            var result = ((eval(valueOfSelectedLoading().join('+')) / 100) * valueOfRelevantRating());
            if (isNaN(result)) {
                result = 0;
            }
            return result;
        }
        return 0;
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
                        clearData();
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
        itemToAdd("");  
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

    var annualPremiumCalcu = ko.computed(function () {//step3a

        var result = valueOfRelevantRating();
        if (isNaN(result) || result === "") {
            result = 0;
        }
        var test = result;
        return result;
    });

    var monthlyPremiumCalcu = ko.computed(function () {//step3
        if (valueOfRelevantRating() > 0) {
            var result = valueOfRelevantRating() / 12;
            return result;
        } else {
            return 0;
        }
    });
     
    var getCalcOfSelectedLoadingTimesItemValue = ko.computed(function () {//step4
        if (valueOfSelectedLoading().length > 0) {
            valueOfSelectedLoading.removeAll();
        }
        if (annualPremiumCalcu() > 0 )
        {
            for (var i = 0; i < selectedLoadings().length; i++) {
                for (var j = 0; j < allLoadings().length; j++) {
                    if (selectedLoadings()[i] === allLoadings()[j].LoadingId) {
                        valueOfSelectedLoading.push(allLoadings()[j].LoadingRate);
                    }
                }
            }
            var test = valueOfSelectedLoading();
            if (valueOfSelectedLoading() != "") {
                var result = eval(valueOfSelectedLoading().join('+')) / 100 * valueOfRelevantRating();
                if (isNaN(result)) {
                    result = 0;
                }
                return result;
            }
        }
        return 0;
        
    });

    var getCalcOfSelectedDiscountTimesItemValue = ko.computed(function () {//step6
        if (valueOfSelectedDiscount().length > 0) {
            valueOfSelectedDiscount.removeAll();
        }
        if (annualPremiumCalcu() > 0) {
            for (var i = 0; i < selectedDiscounts().length; i++) {
                for (var j = 0; j < allDiscounts().length; j++) {
                    if (selectedDiscounts()[i] === allDiscounts()[j].DiscountId) {
                        valueOfSelectedDiscount.push(allDiscounts()[j].DiscountRate);
                    }
                }
            }
            var test = valueOfSelectedDiscount();
            if (valueOfSelectedDiscount() != "") {
                var result = eval(valueOfSelectedDiscount().join('+')) / 100 * valueOfRelevantRating();
                if (isNaN(result)) {
                    result = 0;
                }
                return result;
            }
        }
        return 0;
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
    };

    var addNewItemToExistingQuote = function () {
        var data = {
            ItemDescription : "",
            itemValue       : 0,
            MonthlyPremium  : 0,
            AnnualPremium   : 0 
        }
        selectedItem(data);
    }

    var activate = function () {
        loadSections();
        addquote();
        var quote = localStorage.getItem('TheQuoteObject');
        localStorage.removeItem('TheQuoteObject');
        if (quote) {
            quote = JSON.parse(quote);

        } else {
            addNewItemToExistingQuote();
        }
    }

    var addquote = function () {
        quoteModel([{
            SectionId           : sectionId(),
            ClientName          : clientName(),
            ContactNumber       : contactNumber(),
            TotalMonthlyPremium : totalMonthlyPremium(),
            TotalAnnualPremium  : totalAnnualPremium(),
            insuredItems        : allItems(),
            QuoteWarranties     : selectedWarranties()
          
        }]);
    };
      
    var clearData = function () {
      
        $('#cmbsections').val('');
        $('#txtItemDescription').val('');
        $('#txtItemValue').val('');
        $('#txtComments').val('');
        allLoadings("");
        allDiscounts("");
        allWarranties("");
        valueOfRelevantRating("");
        selectedItem().LocalId = undefined;
         
        return 100;
    }

    var guidLocalId = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

    var addItem = function () {
        var x = document.getElementById("cmbsections").value;
       
        var data = {
            ItemDescription: selectedItem().ItemDescription,
            ItemValue           : ItemValue(),
            MonthlyPremium      : ((valueOfRelevantRating() + bonuses()) - deductions()) / 12,
            AnnualPremium       : ((valueOfRelevantRating() + bonuses()) - deductions()),//valueOfRelevantRating(),
            InsuredItemLoadings : selectedLoadings(),
            InsuredItemDiscounts: selectedDiscounts(),
            InsuredItemWarranties: selectedWarranties(),
            Comments : Comments(),
            SectionId           : x
       
        }
        if (selectedItem().LocalId === undefined) {
            data.LocalId = guidLocalId();

            itemToAdd(data);
            addItem2();
            clearData();
            addquote();

        } else {
            for (var i = 0; i < allItems().length; i++) {
                if (allItems()[i].LocalId === selectedItem().LocalId) {
                    allItems.splice(i, 1, data);
                    clearData();
                    break;
                }
            }
        }
    };
     
    var removequote = function (quote) {
        return app.showMessage('Are you sure you want to cancel creating this quote', 'Delete', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                var form = document.getElementById("newQuote");
                form.reset();

                clearData();
                history.back(1);
            }
        });
    };
     
    var removeItem = function (item) {
        $.each(quoteModel(), function () { this.insuredItems.remove(item) });
    };

    var save = function() {
        return app.showMessage('Are you sure you want to save this quote', 'Saving', ['Yes', 'No']).then(function(result) {
            if (result === "Yes") {
                return dtx.addItemsToQuote(quoteModel()).then(function(result) {
                    if (result) {
                        //dtx.addQuote(quoteModel());
                        toastr.success("Quote is created");
                        var form = document.getElementById("newQuote");
                        form.reset();

                        allItems("");
                        $('#cmbsections').val('');
                        $('#ddlLoadings').val('');
                        $('#ddlDiscounts').val('');

                        window.location.href = '#/dashboard';
                    }
                });
            };
        });
    }
    var deactivate = function() {
            console.log('deactivate grid');
        };

        var close = function() {
            return app.showMessage('Are you sure you want to cancel creating this quote', 'Leaving', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    var form = document.getElementById("newQuote");
                    form.reset();

                    history.back(1);
                }
            });
        };

        var getallSections = function() {
            return allSections();
        }

        var getallLoadings = function() {
            return allLoadings();
        };

        var getallDiscounts = function() {
            return allDiscounts();
        };

        var loadSections = function() {
            return dtx.getSections().then(function(result) {
                allSections(result);
                return dtx.getAllFeesForQuote().then(function(resultOfFees) {
                    allFees(resultOfFees);
                });
            });
        }

        var loadAllChildrenOfSection = function() {
            var x = document.getElementById("cmbsections").value;
            return dtx.getRatings(x).then(function(result) {
                allRatings(result);
                var testRatings = allRatings();
                return dtx.getDiscounts(x).then(function(secondResult) {
                    allDiscounts(secondResult);
                    var test2 = allDiscounts();
                    return dtx.getLoadings(x).then(function(thirdResult) {
                        allLoadings(thirdResult);
                        var test3 = allLoadings();
                        return dtx.getAllWarranties(x).then(function(fourthResult) {
                            if (fourthResult != null) {
                                allWarranties(fourthResult);
                            } else {
                                var data = {
                                    WarrantyDescription: "No waranties"
                                }
                                allWarranties(data);
                            }
                            allWarranties(fourthResult);
                            var test4 = allWarranties();
                        });
                    });
                });
            });
        }

        var getSelectedItem = function(allItem) {

            //new Promise(function(fulfill, reject) {
            //    var isClear = clearData();
            //    if (isClear < 0) {
            //        reject(new Error("could not clear"));
            //    } else {
            //        fulfill(isClear);
            //        selectedItem(allItem);
            //        //selectedItem() = allItem;
            //    }

            //});

            clearData();
            allItem.LocalId = guidLocalId();
            selectedItem(allItem);
            return loadAllChildrenOfSection().then(function(result) {
                if (result === undefined) {
                    checkRating();
                    selectedDiscounts(allItem.InsuredItemDiscounts);
                    selectedLoadings(allItem.InsuredItemLoadings);
                }
            });
        }

        function formatCurrency(value) {
            var test = "R" + value.toFixed(2);
            return test;
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

            //ItemDescription: ItemDescription,
            itemValue: itemValue,
            monthlyPremium: monthlyPremium,
            annualPremium: annualPremium,
            Comments: Comments,

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
            clearData: clearData,

            selectedWarranties: selectedWarranties,

            selectedLoadings: selectedLoadings,
            selectedDiscounts: selectedDiscounts,
            formatCurrency: formatCurrency,
            numberWithCommas: numberWithCommas,

            allWarranties: allWarranties,
            QuoteWarranties: QuoteWarranties

        };
        return vm;
    });
 