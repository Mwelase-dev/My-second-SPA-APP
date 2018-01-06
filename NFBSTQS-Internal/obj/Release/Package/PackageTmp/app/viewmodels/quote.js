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
    var valueOfSelectedLoading = ko.observableArray();
    var valueOfSelectedDiscount = ko.observableArray();
    var valueOfRelevantRating = ko.observable();
    var monthlyPremium = ko.observable();
    var annualPremium = ko.observable();

    var ItemValue = ko.observable();

    var selectedItem = ko.observable();//.extend({ rateLimit: 1500 });
    var quoteToUpdate = ko.observable();
    var sectionId = ko.observable();
    var selectedWarranties = ko.observableArray();
    var savedWarranties = ko.observableArray();

    //var totalMonthlyPremium = ko.computed(function () {
    //    var total = 0;
    //    for (var i = 0; i < items().length; i++) {
    //        total += items()[i].MonthlyPremium;
    //    }
    //    return formatCurrency(total);
    //});

    //var totalAnnualPremium = ko.computed(function () {
    //    var total = 0;
    //    for (var i = 0; i < items().length; i++) {
    //        total += items()[i].AnnualPremium;
    //    }
    //    return formatCurrency(total);

    //});

    //var annualPremiumCalcu = ko.computed(function () {//step3a

    //    var result = valueOfRelevantRating();
    //    if (isNaN(result) || result === "") {
    //        result = 0;
    //    }
    //    return result;
    //});

    //var monthlyPremiumCalcu = ko.computed(function () {//step3
    //    if (valueOfRelevantRating() > 0) {
    //        var result = valueOfRelevantRating() / 12;
    //        return result;
    //    } else {
    //        return 0;
    //    }
    //});

    //var getCalcOfSelectedLoadingTimesItemValue = ko.computed(function () {//step4
    //    if (valueOfSelectedLoading().length > 0) {
    //        valueOfSelectedLoading.removeAll();
    //    }
    //    if (annualPremiumCalcu() > 0) {
    //        for (var i = 0; i < selectedLoadings().length; i++) {
    //            for (var j = 0; j < allLoadings().length; j++) {
    //                if (selectedLoadings()[i] === allLoadings()[j].LoadingId) {
    //                    valueOfSelectedLoading.push(allLoadings()[j].LoadingRate);
    //                }
    //            }
    //        }
    //        var test = valueOfSelectedLoading();
    //        if (valueOfSelectedLoading() != "") {
    //            var result = eval(valueOfSelectedLoading().join('+')) / 100 * valueOfRelevantRating();
    //            if (isNaN(result)) {
    //                result = 0;
    //            }

    //            return result;
    //        }

    //    }
    //    return 0;
    //});

    //var getCalcOfSelectedDiscountTimesItemValue = ko.computed(function () {//step6
    //    if (valueOfSelectedDiscount().length > 0) {
    //        valueOfSelectedDiscount.removeAll();
    //    }

    //    if (annualPremiumCalcu() > 0) {
    //        for (var i = 0; i < selectedDiscounts().length; i++) {
    //            for (var j = 0; j < allDiscounts().length; j++) {
    //                if (selectedDiscounts()[i] === allDiscounts()[j].DiscountId) {
    //                    valueOfSelectedDiscount.push(allDiscounts()[j].DiscountRate);
    //                }
    //            }
    //        }

    //        var test = valueOfSelectedDiscount();
    //        if (valueOfSelectedDiscount() != "") {
    //            var result = eval(valueOfSelectedDiscount().join('+')) / 100 * valueOfRelevantRating();
    //            if (isNaN(result)) {
    //                result = 0;
    //            }

    //            return result;
    //        }

    //    }
    //    return 0;
    //});

    var quoteModel = function () {
        var self = this;

        self.QuoteId             = ko.observable();
        self.ClientName          = ko.observable();
        self.ContactNumber       = ko.observable();
        self.insuredItems        = ko.observableArray();
        self.QuoteWarranties     = ko.observableArray();
        self.TotalAnnualPremium  = ko.computed(function () {
            var total = 0;
            for (var i = 0; i < self.insuredItems().length; i++) {
                total += self.insuredItems()[i].annualPremium() + self.insuredItems()[i].LoadingsValue() - self.insuredItems()[i].DiscountsValue();
            }
            return total;
        });
        self.TotalMonthlyPremium = ko.computed(function () {
            return self.TotalAnnualPremium() / 12;
        });
    }

    function data() {
        var self = this;
        self.IsEditing = true;
        self.ItemId = ko.observable();
        self.SectionId = ko.observable();
        self.ItemDescription = ko.observable("");
        self.ItemValue = ko.observable(0.00);
        self.Comments = ko.observable("");
        self.InsuredItemLoadings = ko.observableArray();
        self.InsuredItemDiscounts = ko.observableArray();
        self.QuoteWarranties = ko.observableArray();
        self.annualPremium = ko.observable();
        self.ItemValue.subscribe(function (newValue) {
            if (self.IsEditing) {

                var subtotal = 0;
                var difference = 0;
                for (var i = 0; i < allRatings().length; i++) {
                    if (newValue < allRatings()[i].Threshold) {
                        if (difference === 0) {
                            subtotal = (newValue * allRatings()[i].RatingPercentageValue);
                            i = allRatings().length;
                        } else {
                            subtotal += (difference * allRatings()[i].RatingPercentageValue);
                            i = allRatings().length;
                        }
                    } else if (newValue >= allRatings()[i].Threshold) {
                        if (i === 0) {
                            subtotal += (allRatings()[i].Threshold * allRatings()[i].RatingPercentageValue);
                            difference = newValue - allRatings()[i].Threshold;
                        } else {
                            subtotal += ((allRatings()[i].Threshold - allRatings()[i - 1].Threshold) * allRatings()[i].RatingPercentageValue);
                            difference = newValue - allRatings()[i].Threshold;
                        }
                    } else {
                        subtotal += (difference * allRatings()[i].RatingPercentageValue);
                    }
                }
           
                self.annualPremium(subtotal);
            }
        }, self);
        self.monthlyPremium = ko.computed(function() {
                return self.annualPremium() / 12;
            }, self),
        self.LoadingsValue = ko.observable();
        self.InsuredItemLoadings.subscribe(function (newValue) { //step4
            if (self.IsEditing) {
                var result = 0;
                if (self.annualPremium() > 0) {
                    for (var i = 0; i < self.InsuredItemLoadings().length; i++) {
                        for (var j = 0; j < allLoadings().length; j++) {
                            if (self.InsuredItemLoadings()[i] === allLoadings()[j].LoadingId) {
                                result += allLoadings()[j].LoadingRate;
                            }
                        }

                    }
                }
                self.LoadingsValue((result / 100) * self.annualPremium());
            }
        }, self),
        self.DiscountsValue = ko.observable();
        self.InsuredItemDiscounts.subscribe(function (newValue) { //step4
            if (self.IsEditing) {
            var result = 0;
            if (self.annualPremium() > 0) {
                for (var i = 0; i < self.InsuredItemDiscounts().length; i++) {
                    for (var j = 0; j < allDiscounts().length; j++) {
                        if (self.InsuredItemDiscounts()[i] === allDiscounts()[j].DiscountId) {

                            result += allDiscounts()[j].DiscountRate;
                        }
                    }

                }
            }
            self.DiscountsValue((result / 100) * self.annualPremium());
        }
        }, self);
        self.TotalAnnualPremium = ko.computed(function () {
            var result = self.annualPremium() + self.LoadingsValue() - self.DiscountsValue();
            if (isNaN(result)) {
                result = 0;
            }
            return result;
        }, self);
        self.TotalMonthlyPremium = ko.computed(function () {
            return self.TotalAnnualPremium() / 12;
        }, self);
        self.SectionId.subscribe(function (newValue) {
            //if (self.IsEditing) {
            return loadAllChildrenOfSection(newValue);
            //}
        });
        //self.SectionId = ko.observable();
    };

    var clearAfterSaving = function () {
        $('#cmbsections').val('');
        $('#ddlWarranties').val('');
        $('#txtItemDescription').val('');
        $('#txtItemValue').val('');
        $('#txtComments').val('');
        allLoadings([]);
        allDiscounts([]);
        valueOfRelevantRating([]);
        addNewItemToExistingQuote(false);
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

    var updateItem = function () {

        var data = selectedItem();
        data.IsEditing = false;
     
        if (data.LocalId === undefined && data.ItemId() === undefined) {
            if (data.ItemDescription() != null && quoteToUpdate().insuredItems().indexOf(data) < 0) {
                data.LocalId = guidLocalId();
                quoteToUpdate().insuredItems.push(data);
            }
        }else if(data.ItemId() != undefined ){
            for (var j = 0; j < quoteToUpdate().insuredItems().length; j++) {
                if (data.ItemId() === quoteToUpdate().insuredItems()[j].ItemId()) {
                    quoteToUpdate().insuredItems.splice(j, 1, data);
                    break;
                }
            }
        } else {
            for (var i = 0; i < quoteToUpdate().insuredItems().length; i++) { 
                if (data.LocalId === quoteToUpdate().insuredItems()[i].LocalId) {
                    quoteToUpdate().insuredItems.splice(i, 1, data);
                    break;
                }
            }
        }
        $('#ddlWarranties').val('');
        addNewItemToExistingQuote();
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
    };

    var loadSections = function () {
        return dtx.getSections().then(function (result) {
            if (result.SectionName !== "No Sections found") {
                allSections(result);
            }

            //toastr.success("Sections Loaded");
            return dtx.getAllFeesForQuote(allFees).then(function (resultOfFees) {
                allFees(resultOfFees);
                //toastr.success("Fees Loaded");
            });
        });
    }

    var addNewItemToExistingQuote = function () {
 
        var test = selectedItem();
        if (test != undefined) {
            test.IsEditing = false;
        }
        selectedItem(new data());
    }

    var loadAllChildrenOfSection = function (sectionId) {
        return dtx.getRatings(sectionId).then(function (result) {
            allRatings(result);
            var testRatings = allRatings();
            return dtx.getDiscounts(sectionId).then(function (secondResult) {
                if (secondResult != null) {
                    //var select = document.getElementById("ddlDiscounts");
                    //var length = select.options.length;
                    //for (var i = 0; i < length; i++) {
                    //    select.options[i] = null;
                    //}

                    //allDiscounts = [];

                    //for (var j = 0; j < secondResult.length; j++) {
                    //    allDiscounts.push(secondResult[j]);
                    //}

                    //var sel = document.getElementById('ddlDiscounts');
                    //for (var k = 0; k < secondResult.length; k++) {
                    //    var opt = document.createElement('option');
                    //    opt.innerHTML = secondResult[k].DiscountDescription;
                    //    opt.value = secondResult[k].DiscountId;
                    //    sel.appendChild(opt);
                    //}



                    allDiscounts(secondResult);
                    var test2 = allDiscounts();
                } else {
                    var data = {
                        DiscountDescription: "NoDiscount",
                        DiscountId: "",
                        DiscountRate: 0,
                        RecId: "",
                        SectionId: ""
                    }
                    allDiscounts(data);
                }

                return dtx.getLoadings(sectionId).then(function (thirdResult) {
                    if (thirdResult != null) {

                        //var select = document.getElementById("ddlLoadings");
                        //var length = select.options.length;
                        //for (var i = 0; i < length; i++) {
                        //    select.options[i] = null;
                        //}
                        ////allLoadings.clear();
                        //allLoadings = [];

                        //for (var j = 0; j < thirdResult.length; j++) {
                        //    allLoadings.push(thirdResult[j]);
                        //}

                        //var sel = document.getElementById('ddlLoadings');
                        //for (var k = 0; k < thirdResult.length; k++) {
                        //    var opt = document.createElement('option');
                        //    opt.innerHTML = thirdResult[k].LoadingDescription;
                        //    opt.value = thirdResult[k].LoadingId;
                        //    sel.appendChild(opt);
                        //}

                        allLoadings(thirdResult);
                        var test3 = allLoadings();
                    } else {
                        var data = {
                            LoadingDescription: "NoLoading",
                            LoadingId: "",
                            LoadingRate: 0,
                            RecId: "",
                            SectionId: ""
                        }
                        allLoadings(data);
                    }
                    return dtx.getAllWarranties(sectionId).then(function (fourthResult) {
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


        var clone = new data();
        for (prop in item) {
            if (item.hasOwnProperty(prop)) {
                if (!ko.isComputed(item[prop])) {
                    if (ko.isObservable(item[prop])) {
                        clone[prop](item[prop]());
                    } else {
                        clone[prop] = item[prop];
                    }
                }
            }
        }
       
        return loadAllChildrenOfSection(item.SectionId()).then(function (result) {
            clone.IsEditing = true;
            //clone.LocalId = guidLocalId();
            selectedItem(clone);

        });

    }

    var removeSelected = function (item) {
        return app.showMessage('Are you sure you want remove this item', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {

                quoteToUpdate().insuredItems.remove(item);
                if (item.ItemId() != undefined) {
                    dtx.deleteInsuredItemFromSavedQuote(item.ItemId());
                }
                clearAfterSaving();
            }
        });
    };

    var save = function () {
        //dtx.addItemsToQuote(quoteModel());
        var userDetails = localStorage.getItem('TheLoggeinUserDetails');
        if (userDetails) userDetails = JSON.parse(userDetails);
        quoteToUpdate().UnderWriter = userDetails.FirstName + ' ' + userDetails.LastName;
        return dtx.addItemsToQuote(quoteToUpdate()).then(function (result) {
            if (result) {
                toastr.success("Save successful");
                window.location.href = '#/dashboard';
            }
        });
    };

    var close = function () {
        return app.showMessage('Are you sure you want to cancel creating this quote', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                var form = document.getElementById("quote");
                form.reset();
                selectedItem("");
                window.location.href = '#/dashboard';
            }
        });
    };

    var loadQuoteToUpdateWithNullValues = function () {
        quoteToUpdate(new quoteModel());
    }
     
    var loadItemsOfTheQuote = function (quote) {
        return dtx.getItemsByQuoteId(quote.QuoteId).then(function (result) {
            items(result);
        });
    }

    var loadQuoteToUpdate = function () {
        var quote = localStorage.getItem('TheQuoteObject');
        localStorage.removeItem('TheQuoteObject');
        if (quote) {
            quote = JSON.parse(quote);
            var quoteData = new quoteModel();
            quoteData.ClientName(quote.ClientName);
            quoteData.ContactNumber(quote.ContactNumber);
            quoteData.QuoteWarranties(quote.QuoteWarranties);
            quoteData.QuoteId(quote.QuoteId);

            return dtx.getItemsByQuoteId(quote.QuoteId).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    var insuredItem = new data();

                    insuredItem.IsEditing = true;
                    insuredItem.annualPremium(result[i].AnnualPremium);
                    insuredItem.SectionId(result[i].SectionId);
                    

                    insuredItem.ItemId(result[i].ItemId);
                    
                    insuredItem.ItemDescription(result[i].ItemDescription);
                    insuredItem.ItemValue(result[i].ItemValue);
                    insuredItem.Comments(result[i].Comments);
                    insuredItem.InsuredItemLoadings(result[i].InsuredItemLoadings);
                    insuredItem.InsuredItemDiscounts(result[i].InsuredItemDiscounts);
                    insuredItem.QuoteWarranties(result[i].QuoteWarranties);
                   

                    quoteData.insuredItems.push(insuredItem);
                }

                quoteToUpdate(quoteData);
                addNewItemToExistingQuote();
            });
        } else {
            loadQuoteToUpdateWithNullValues();
            addNewItemToExistingQuote();
        }
    };

    var activate = function () {
        return loadSections().then(function () {
            return loadQuoteToUpdate();
        });
    }

    var cancel = function () {
        clearAfterSaving();
    }

    function formatCurrency(value) {
        var test = "R" + value.toFixed(2);
        return test;
    }

    function numberWithCommas(x) {
        //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        return parts.join(".");
    }

    var addWarranties = function () {
        var objectToSend = JSON.stringify(allWarranties());
        localStorage.setItem('TheWarranties', objectToSend);
        location.href = '#/warrantyPopUp';
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
        valueOfRelevantRating: valueOfRelevantRating,
        valueOfSelectedLoading: valueOfSelectedLoading,
        valueOfSelectedDiscount: valueOfSelectedDiscount,
        //monthlyPremiumCalcu: monthlyPremiumCalcu,
        //annualPremiumCalcu: annualPremiumCalcu,
        //monthlyPremium: monthlyPremium,
        //annualPremium: annualPremium,
        //totalMonthlyPremium: totalMonthlyPremium,
        //totalAnnualPremium: totalAnnualPremium,
        selectedLoadings: selectedLoadings,
        selectedDiscounts: selectedDiscounts,
        cancel: cancel,
        numberWithCommas: numberWithCommas,
        formatCurrency: formatCurrency,
        allRatings: allRatings,
        addWarranties: addWarranties,
        selectedWarranties: selectedWarranties,
        savedWarranties: savedWarranties,
        //getCalcOfSelectedLoadingTimesItemValue: getCalcOfSelectedLoadingTimesItemValue,
        //getCalcOfSelectedDiscountTimesItemValue: getCalcOfSelectedDiscountTimesItemValue,

    };
    return vm;
});
