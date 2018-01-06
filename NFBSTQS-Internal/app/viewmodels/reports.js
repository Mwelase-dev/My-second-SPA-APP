define(['durandal/system', 'jquery', 'knockout', 'durandal/app', 'services/datacontext', 'toastr'], function (system, $, ko, app, dtx, toastr) {
    var quoteToPrint = ko.observable();
    var items = ko.observableArray();
    var fees = ko.observableArray();
    var excesses = ko.observableArray();
    var commisions = ko.observableArray();
   
    var pdf = ko.observableArray();
    var allSections = ko.observableArray();

    var sectionLabelIds = ko.observableArray();
    var sectionLabels = ko.observableArray();

    var houseOwners = ko.observableArray();
    var householdContents = ko.observableArray();
    var accidentalDamageCover = ko.observableArray();
    var generalAllRisks = ko.observableArray();
    var specifiedAllRisks = ko.observableArray();
    var personalLiability = ko.observableArray();
    var motor = ko.observableArray();
    var computers = ko.observableArray();
    var sasria = ko.observableArray();


    var totalCommisionComponent = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < commisions().length; i++) {
            total += commisions()[i].CommisionValue;
        }
        return total;
    });
    var totalMonthlyPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < items().length; i++) {
            total += items()[i].MonthlyPremium;
        }
        return total;
    });
    var totalAnnualPremium = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < items().length; i++) {
            total += items()[i].AnnualPremium;
        }
        return (total);

    });
    var totalFees = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < fees().length; i++) {
            total += fees()[i].FeeValue;
        }
        return (total);

    });
    var overalTotal = ko.computed(function () {
        var total = 0;

        if (totalMonthlyPremium() === undefined) {
            total = 0;
        }

        total += totalMonthlyPremium();
        for (var i = 0; i < fees().length; i++) {
            total += fees()[i].FeeValue;
        }
        total += totalCommisionComponent();
        return total;
    });

    var loadItemsOfTheQuote = function (quote) {
        sectionLabels([]);
        sectionLabels([]);
        return dtx.getItemsByQuoteId(quote.QuoteId).then(function (result) {
            items(result);
            return dtx.getSections().then(function (result) {
                if (result) {
                    allSections(result);
                    for (var i = 0; i < items().length; i++) {
                        sectionLabelIds(items()[i].SectionId);
                        for (var j = 0; j < allSections().length; j++) {
                            if (sectionLabelIds() === allSections()[j].SectionId && sectionLabels().indexOf(allSections()[j].SectionName) < 0) {
                                sectionLabels.push(allSections()[j].SectionName);
                            }
                         
                        }
                    }
 
                    //for (var i = 0; i < items().length; i++) {
                    //    for (var j = 0; j < allSections().length; j++) {
                    //        if (items()[i].SectionId === allSections()[j].SectionId) {
                    //            allSections()[j].InsuredItem = items()[i];
                    //            var test = allSections();
                    //        }
                    //    }
                    //}
                    var test = sectionLabels();
                }
            });
        });
    }

    function formatCurrency(value) {
        var test = "R" + value.toFixed(2);
        return test;
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    var test = function () {
        var quoteReportHtml = document.documentElement.innerHTML;
        //var element = document.getElementById("logos");
        //element.outerHTML = "";
        var htmlElement = document.getElementById("quoteReport").innerHTML;


        quoteToPrint().Markup = htmlElement;
        dtx.reportQuote2(quoteToPrint());
        // alert(markup);
    }

    function activate() {
        var quote = localStorage.getItem('TheQuoteObjectToBePrinted');
        localStorage.removeItem('TheQuoteObjectToBePrinted');
        if (quote) {
            quote = JSON.parse(quote);
            quoteToPrint(quote);
            loadItemsOfTheQuote(quote);
            return dtx.getAllFeesForQuote(fees).then(function (result) {
                return dtx.getAllExcess(excesses).then(function(result) {
                    return dtx.getAllCommisions(commisions).then(function (result) {

                    });
                });

            });

            var test = fees();
        }
        //else {
            //toastr.warning("There are no Quotes to print");
        //}

    }

    var vm = {
        activate: activate,
        items: items,
        fees: fees,
        quoteToPrint: quoteToPrint,
        totalMonthlyPremium: totalMonthlyPremium,
        overalTotal: overalTotal,
        totalAnnualPremium: totalAnnualPremium,
        numberWithCommas: numberWithCommas,
        formatCurrency: formatCurrency,
        excesses: excesses,
        pdf: pdf,
        totalFees: totalFees,
        test: test,
        commisions:commisions,


        houseOwners: houseOwners,
        householdContents: householdContents,
        accidentalDamageCover: accidentalDamageCover,
        generalAllRisks: generalAllRisks,
        specifiedAllRisks: specifiedAllRisks,
        personalLiability: personalLiability,
        motor: motor,
        computers: computers,
        sasria: sasria,
        sectionLabels: sectionLabels,
        totalCommisionComponent: totalCommisionComponent

    };

    return vm;
});