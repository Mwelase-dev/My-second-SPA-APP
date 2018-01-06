define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
    var items = ko.observableArray();
    var allFees = ko.observableArray();
    var allRatings = ko.observableArray();
    var allSections = ko.observableArray();
    var allLoadings = ko.observableArray();
    var allDiscounts = ko.observableArray();
    var allWarranties = ko.observableArray();
    var selectedLoadings = ko.observableArray();
    var selectedDiscounts = ko.observableArray();
    var selectedWarranties = ko.observableArray();
    var valueOfSelectedLoading = ko.observableArray();
    var valueOfSelectedDiscount = ko.observableArray();
    var valueOfRelevantRating = ko.observable();
    var monthlyPremium = ko.observable();
    var annualPremium = ko.observable();
    var ItemDescription = ko.observable();
    var ItemValue = ko.observable();
    var itemToAdd = ko.observable();
    //var Email = ko.observable();
    var selectedItem = ko.observable();
    var quoteToUpdate = ko.observable();
    var sectionId = ko.observable();

    var busyWorking = ko.observable(0);

    var totalMonthlyPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < items().length; i++) {
            total += items()[i].MonthlyPremium;
        }
        return formatCurrency(total);
    });
    var totalAnnualPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < items().length; i++) {
            total += items()[i].AnnualPremium;
        }
        return formatCurrency(total);

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

    var annualPremiumCalcu = ko.computed(function () {//step3a

        var result = valueOfRelevantRating();
        if (isNaN(result) || result === "") {
            result = 0;
        }
        return (result);
    });

    var monthlyPremiumCalcu = ko.computed(function () {//step3
        if (valueOfRelevantRating() > 0) {
            var result = valueOfRelevantRating() / 12;
            return (result.toFixed(2));
        } else {
            return 0;
        }
    });

    var getCalcOfSelectedLoadingTimesItemValue = ko.computed(function () {//step4
        if (valueOfSelectedLoading().length > 0) {
            valueOfSelectedLoading.removeAll();
        }
        if (annualPremiumCalcu() > 0) {
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

                return result.toFixed(2); 
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

                return result.toFixed(2);
            }

        }
        return 0;
    });

    var clearAfterSaving = function () {
        $('#cmbsections').val('');
        $('#txtItemDescription').val('');
        $('#txtItemValue').val('');
        $('#txtComments').val('');

        $('#ddlWarranties').val(0);
        $('#ddlLoadings').val(0);
        $('#ddlDiscounts').val(0);

         

        valueOfRelevantRating("");
        addNewItemToExistingQuote();

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

    var addItem2 = function () {
        var value = itemToAdd();
        if (value != "" && items.indexOf(value) < 0) { // Prevent blanks and duplicates
            items.push(value);
        }
        itemToAdd("");
        return 100;
    }

    var updateItem = function () {
        var x = document.getElementById("cmbsections").value;

        var data = {
            ItemId: selectedItem().ItemId,
            ItemDescription: selectedItem().ItemDescription,
            ItemValue: selectedItem().ItemValue,
            MonthlyPremium: ((valueOfRelevantRating() + bonuses()) - deductions()) / 12,
            AnnualPremium: ((valueOfRelevantRating() + bonuses()) - deductions()),
            InsuredItemLoadings: selectedLoadings(),
            InsuredItemDiscounts: selectedDiscounts(),
            QuoteWarranties: selectedWarranties(),
            SectionId: x,
            LocalId: selectedItem().LocalId,
            Comments: selectedItem().Comments
        }

        if (data.LocalId === undefined && data.ItemId === undefined) {
            if (data.ItemDescription != null && items().indexOf(data) < 0) {
                data.LocalId = guidLocalId();
                items.push(data);
                clearAfterSaving();
            }
        } else if (data.ItemId != undefined) {
            for (var j = 0; j < items().length; j++) {
                if (data.ItemId === items()[j].ItemId) {
                    items.splice(j, 1, data);
                    clearAfterSaving();
                    break;
                }
            }
        } else {
            for (var i = 0; i < items().length; i++) {
                if (data.LocalId === items()[i].LocalId) {
                    items.splice(i, 1, data);
                    clearAfterSaving();
                    break;
                }
            }
        }
    }

    var getRatingsToUseInCalculation = function () {//step2
        var subtotal = 0;
        var test = allRatings();
        var difference = 0;
        //
        var x = document.getElementById("txtItemValue").value;
        ItemValue(x);
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

    var checkRating = function (item) {//step1
        getRatingsToUseInCalculation();
        var test = valueOfRelevantRating();
        if (test != "") {
            //toastr.success("found relevant rating");
        }
    };

    var loadSections = function () {

        return dtx.getSections().then(function (result) {
            allSections(result);
            return dtx.getAllFeesForQuote(allFees).then(function (resultOfFees) {
                allFees(resultOfFees);
            });
        });

    }

    var loadAllChildrenOfSection = function () {
        var x = "";
        if (!document.getElementById("cmbsections")) {
            x = allSections()[0].SectionId;
        } else {
            x = document.getElementById("cmbsections").value;
        }

        return dtx.getRatings(x).then(function (result) {
            allRatings(result);

            return dtx.getDiscounts(x).then(function (secondResult) {
                allDiscounts(secondResult);

                return dtx.getLoadings(x).then(function (thirdResult) {
                    allLoadings(thirdResult);

                    checkRating();
                    return dtx.getAllWarranties(x).then(function (fourthResult) {
                        allWarranties(fourthResult);
                    });
                });
            });
        });
        return true;
    }
    var getallWarranties = function () {
        return allWarranties();
    }
    var getallSections = function () {
        return allSections();
    }

    var getallLoadings = function () {
        return allLoadings();
    };

    var getallDiscounts = function () {
        return allDiscounts();
    };

    var getSelectedItem = function (item) {
        var dataCopy = item;

        selectedItem(dataCopy);

        return loadAllChildrenOfSection().then(function (result) {
            if (result === undefined) {
                checkRating();
                selectedDiscounts(item.InsuredItemDiscounts);
                selectedLoadings(item.InsuredItemLoadings);
                selectedWarranties(item.QuoteWarranties);
            }
        });

    }

    var removeSelected = function (item) {
        return app.showMessage('Are you sure you want remove this quote', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                for (var i = 0; i < items().length; i++) {
                    if (items()[i] === item) {
                        items.splice(i, 1);
                        break;
                    }
                }
                if (item.ItemId != undefined) {
                    dtx.deleteInsuredItemFromSavedQuote(item.ItemId);
                }
                clearAfterSaving();
            }
        });
    };

    var save = function () {
        if (items().length > 0) {
            if (quoteToUpdate().ClientName != "") {
                if (quoteToUpdate().ContactNumber != "") {
                    busyWorking(1);
                    var userDetails = localStorage.getItem('TheLoggeinUserDetails');
                    if (userDetails) userDetails = JSON.parse(userDetails);
                    quoteToUpdate().UnderWriter = userDetails.FirstName + ' ' + userDetails.LastName;

                    //quoteToUpdate().Email = Email();
                    quoteToUpdate().InsuredItems = items();
                    return dtx.addItemsToQuote(quoteToUpdate()).then(function (result) {
                        if (result) {
                            clearAfterSaving();
                            var form = document.getElementById("editQuote");
                            form.reset();
                            window.location.href = '#/dashboard';
                        }
                    });
                } else {
                    toastr.warning("Please fill in client contact number field");
                }
            } else {
                toastr.warning("Please fill in client name field");
            }
        } else {
            toastr.warning("Please add atleast one item to this quote");
        }
    };

    var close = function () {
        return app.showMessage('Are you sure you want to cancel creating this quote', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                var form = document.getElementById("editQuote");
                form.reset();
                selectedItem("");
                history.back(1);
            }
        });
    };

    var loadItemsOfTheQuote = function (quote) {
        return dtx.getItemsByQuoteId(quote.QuoteId).then(function (result) {
            items(result);
        });
    }

    var loadQuoteToUpdate = function () {
        var quote = localStorage.getItem('TheQuoteObject');
        localStorage.removeItem('TheQuoteObject');
        if (quote) quote = JSON.parse(quote);
        if (quote != null) {
            quoteToUpdate(quote);
            loadItemsOfTheQuote(quote);
        } else {
            items([]);
            var quoteData = {
                QuoteId: "",
                ClientName: "",
                ContactNumber: "",
                insuredItems: "",
                QuoteWarranties: "",
                TotalAnnualPremium: "",
                TotalMonthlyPremium: ""
            }
            quoteToUpdate(quoteData);
            //loadAllChildrenOfSection();
        }
    }

    var addNewItemToExistingQuote = function () {

        var data = {
            ItemId: "",
            ItemDescription: "",
            ItemValue: 0,
            MonthlyPremium: 0,
            AnnualPremium: 0

            //SectionId: ""
        }
        selectedItem(data);
        allLoadings([]);
        allDiscounts([]);
        valueOfRelevantRating([]);
        selectedItem([]);
        allWarranties([]);

    }

    var activate = function () {
        addNewItemToExistingQuote();
        return dtx.getSections().then(function (result) {
            allSections(result);
            busyWorking(0);
            loadAllChildrenOfSection();
            return dtx.getAllFeesForQuote(allFees).then(function (resultOfFees) {
                allFees(resultOfFees);
                loadQuoteToUpdate();
            });
        });
    }

    var cancel = function () {
        addNewItemToExistingQuote();
    }

    function formatCurrency(value) {
        var test = "R" + value.toFixed(2);
        return test;
    }

    function formatDecimal(value) {
        var test = value.toFixed(2);
        return test;
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    var vm = {
        activate: activate,
        quoteToUpdate: quoteToUpdate,
        items: items,
        selectedItem: selectedItem,
        loadQuoteToUpdate: loadQuoteToUpdate,
        loadItemsOfTheQuote: loadItemsOfTheQuote,
        removeSelected: removeSelected,
        loadAllChildrenOfSection: loadAllChildrenOfSection,
        allLoadings: getallLoadings,
        allDiscounts: getallDiscounts,
        allSections: getallSections,
        allWarranties: getallWarranties,
        getSelectedItem: getSelectedItem,
        sectionId: sectionId,
        loadSections: loadSections,
        save: save,
        close: close,
        checkRating: checkRating,
        updateItem: updateItem,
        ItemValue: ItemValue,
        ItemDescription: ItemDescription,
        valueOfRelevantRating: valueOfRelevantRating,
        valueOfSelectedLoading: valueOfSelectedLoading,
        valueOfSelectedDiscount: valueOfSelectedDiscount,
        monthlyPremiumCalcu: monthlyPremiumCalcu,
        annualPremiumCalcu: annualPremiumCalcu,
        getCalcOfSelectedDiscountTimesItemValue: getCalcOfSelectedDiscountTimesItemValue,
        getCalcOfSelectedLoadingTimesItemValue: getCalcOfSelectedLoadingTimesItemValue,
        monthlyPremium: monthlyPremium,
        annualPremium: annualPremium,
        totalMonthlyPremium: totalMonthlyPremium,
        totalAnnualPremium: totalAnnualPremium,
        selectedLoadings: selectedLoadings,
        selectedDiscounts: selectedDiscounts,
        selectedWarranties: selectedWarranties,
        addItem2: addItem2,
        cancel: cancel,
        numberWithCommas: numberWithCommas,
        formatCurrency: formatCurrency,
        formatDecimal : formatDecimal,
        busyWorking: busyWorking,
        //Email: Email
    };
    return vm;
});