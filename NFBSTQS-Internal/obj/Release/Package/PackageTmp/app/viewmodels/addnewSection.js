define(['plugins/dialog', 'knockout', 'services/datacontext', 'jquery', 'durandal/app', 'toastr'], function (dialog, ko, dtx, $, app, toastr) {
    var sectionObjectWithChildrenToBeUpdated = ko.observable("");
    var sectionModel = ko.observableArray();
    var sectionId = ko.observable();
    var sectionName = ko.observable();
    var loadings = ko.observableArray();
    var discounts = ko.observableArray();
    var ratings = ko.observableArray();

    var selectedRating = ko.observable();
    var selectedDiscount = ko.observable();
    var selectedLoading = ko.observable();

    var allRatings = ko.observableArray();
    var allDiscounts = ko.observableArray();
    var allLoadings = ko.observableArray();

    //properties
    var RatingDescription = ko.observable();
    var Threshold = ko.observable();
    var RatingPercentageValue = ko.observable();
    var RatingInRands = ko.observable();

    var LoadingDescription = ko.observable();
    var LoadingRate = ko.observable();

    var DiscountDescription = ko.observable();
    var DiscountRate = ko.observable();
    //properties

    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    var getSelectedRating = function (allRating) {
        selectedRating(allRating);
        selectedRating().LocalId = guidLocalId();

    }
    var getSelectedDiscount = function (allDiscount) {
        selectedDiscount(allDiscount);
        selectedDiscount().LocalId = guidLocalId();
    }
    var getSelectedLoading = function (allLoading) {
        selectedLoading(allLoading);
        selectedLoading().LocalId = guidLocalId();
    }

    var removeSelectedRating = function (allRating) {
        return app.showMessage('Are you sure you want remove this rating', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                allRatings.remove(allRating);
                dtx.deleteRating(allRating.RatingId);
                addNewRatings();
            }
        });
    }
    var removeSelectedDiscount = function (allDiscount) {
        return app.showMessage('Are you sure you want remove this discount', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                allDiscounts.remove(allDiscount);
                dtx.deleteDiscount(allDiscount.DiscountId);
                addNewDiscount();
            }
        });
    }
    var removeSelectedLoading = function (allLoading) {
        return app.showMessage('Are you sure you want remove this loading', 'Removing', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                allLoadings.remove(allLoading);
                dtx.deleteLoading(allLoadings.LoadingId);
                addNewLoading();
            }
        });
    }


    var addNewRatings = function () {
        var data = {
            RatingDescription: "",
            Threshold: "",
            RatingPercentageValue: "",
            RatingInRands: ""
        };
        selectedRating(data);
    };
    var addNewLoading = function () {
        var data = {
            LoadingDescription: "",
            LoadingRate: ""
        };
        selectedLoading(data);
    };
    var addNewDiscount = function () {
        var data = {
            DiscountDescription: "",
            DiscountRate: ""
        };
        selectedDiscount(data);
    };

    var guidLocalId = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

    var addSection = function () {
        sectionModel([{
            sectionId: sectionId(),
            sectionName: sectionName(),
            loadings: allLoadings(),
            discounts: allDiscounts(),
            ratings: allRatings()
        }]);
    }

    var removeSection = function (section) {
        sectionModel.remove(section);
    };

    var addLoading = function () {
        if (selectedLoading().LoadingDescription, selectedLoading().LoadingRate) {
            var data = {
                LoadingDescription: selectedLoading().LoadingDescription,
                LoadingRate       : selectedLoading().LoadingRate,
                LoadingId         : selectedLoading().LoadingId,
                SectionId         : selectedLoading().SectionId
            };
            if (selectedLoading().LocalId === undefined) {
                if (data.LoadingDescription != null && allLoadings.indexOf(data) < 0) { // Prevent blanks and duplicates
                    allLoadings.push(data);
                    addNewLoading();
                }
            } else {
                for (var i = 0; i < allLoadings().length; i++) {
                    if (allLoadings()[i].LocalId === selectedLoading().LocalId) {
                        data.LocalId = selectedLoading().LocalId;
                        allLoadings.splice(i, 1, data);
                        addNewLoading();
                        break;
                    }
                }
            }
        } else {
            toastr.warning("You cannot save null values!");
        }
    };

    var addDiscount = function () {
        if (selectedDiscount().DiscountDescription, selectedDiscount().DiscountRate) {
            var data = {
                DiscountDescription: selectedDiscount().DiscountDescription,
                DiscountRate: selectedDiscount().DiscountRate,
                DiscountId: selectedDiscount().DiscountId,
                SectionId: selectedDiscount().SectionId
            };
            if (selectedDiscount().LocalId === undefined) {
                if (data.DiscountDescription != null && allDiscounts.indexOf(data) < 0) { // Prevent blanks and duplicates
                    allDiscounts.push(data);
                    addNewDiscount();
                }
            } else {
                for (var i = 0; i < allDiscounts().length; i++) {
                    if (allDiscounts()[i].LocalId === selectedDiscount().LocalId) {
                        data.LocalId = selectedDiscount().LocalId;
                        allDiscounts.splice(i, 1, data);
                        addNewDiscount();
                        break;
                    }
                }
            }
        } else {
            toastr.warning("You cannot save null values!");
        }

    };

    var addRatings = function () {
        if (selectedRating().RatingDescription != "" && selectedRating().Threshold != "" && selectedRating().RatingPercentageValue != "" && selectedRating().RatingInRands != "") {
            var data = {
                RatingDescription: selectedRating().RatingDescription,
                RatingId: selectedRating().RatingId,
                SectionId: selectedRating().SectionId,
                Threshold: selectedRating().Threshold,
                LocalId: selectedRating().LocalId,
                RatingPercentageValue: selectedRating().RatingPercentageValue,
                RatingInRands: selectedRating().RatingInRands
            };

            if (selectedRating().LocalId === undefined) {
                if (data.RatingDescription != null && allRatings.indexOf(data) < 0) { // Prevent blanks and duplicates
                    allRatings.push(data);
                    addNewRatings();
                }
            } else {
                for (var i = 0; i < allRatings().length; i++) {
                    if (allRatings()[i].LocalId === selectedRating().LocalId) {
                        selectedRating().LocalId = selectedRating().LocalId;
                        allRatings.splice(i, 1, data);
                        addNewRatings();
                        break;
                    }
                }
            }
        } else {
            toastr.warning("You cannot save null values!");
        }
    };

    var removeDiscount = function (discounts) {
        $.each(sectionModel(), function () { this.discounts.remove(discounts) });
    };

    var removeLoading = function (loadings) {
        $.each(sectionModel(), function () { this.loadings.remove(loadings) });
    };

    var removeRating = function (rating) {
        $.each(sectionModel(), function () { this.ratings.remove(rating) });
    };

    var save = function () {
        if (sectionObjectWithChildrenToBeUpdated() === "") {
            var test = sectionModel();
            addSection();

            return dtx.addSections(sectionModel()).then(function (result) {
                if (result) {
                    toastr.success("Section is saved");
                    window.location.href = '#/manageSections';
                }
            });
        } else {
            toastr.success("Save unsuccessful");
        }
    };

    var close = function () {
        return app.showMessage('Are you sure you want to cancel adding new section?', 'Leaving', ['Yes', 'No']).then(function (result) {
            if (result === "Yes") {
                addSection();
                addNewRatings([]);
                addNewLoading([]);
                addNewDiscount([]);

                history.back(1);
            }
        });
    };

    var loadSectionObjectWithChildrenToBeUpdated = function () {

        var section = localStorage.getItem('TheSection');
        localStorage.removeItem('TheSection');
        if (section) {
            section = JSON.parse(section);
            sectionName(section.sectionName);
            sectionId(section.SectionId);
            var x = sectionId();
            var theName = localStorage.getItem('TheSectionName');
            localStorage.removeItem('TheSectionName');

            if (x != null) {
                sectionName(theName);
                return dtx.getRatings(x).then(function (result) {
                    allRatings(result);
                    var testRatings = allRatings();
                    return dtx.getDiscounts(x).then(function (secondResult) {
                        if (secondResult != null) {
                            allDiscounts(secondResult);
                            var test2 = allDiscounts();
                        }
                        return dtx.getLoadings(x).then(function (thirdResult) {
                            if (thirdResult != null) {
                                allLoadings(thirdResult);
                                var test3 = allLoadings();
                            }
                        });
                    });
                });
            }
        } else {
            allRatings([]);
            allDiscounts([]);
            allLoadings([]);
            sectionName('');
            addSection();
            addNewRatings();
            addNewLoading();
            addNewDiscount();
        }

    };

    $(document).ready(function () {
        $("#txtMwe").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });

    var activate = function () {
        loadSectionObjectWithChildrenToBeUpdated();
    }

    var vm = {
        activate: activate,
        sections: sectionModel,
        sectionObjectWithChildrenToBeUpdated: sectionObjectWithChildrenToBeUpdated,
        addSection: addSection,
        removeSection: removeSection,


        save: save,
        close: close,
        addRatings: addRatings,
        removeRating: removeRating,
        addLoading: addLoading,
        addDiscount: addDiscount,
        removeDiscount: removeDiscount,
        removeLoading: removeLoading,
        sectionName: sectionName,
        ratings: ratings,
        loadings: loadings,
        discounts: discounts,

        selectedRating: selectedRating,
        selectedDiscount: selectedDiscount,
        selectedLoading: selectedLoading,

        allRatings: allRatings,
        allDiscounts: allDiscounts,
        allLoadings: allLoadings,

        RatingDescription: RatingDescription,
        Threshold: Threshold,
        RatingPercentageValue: RatingPercentageValue,
        RatingInRands: RatingInRands,

        LoadingDescription: LoadingDescription,
        LoadingRate: LoadingRate,

        DiscountDescription: DiscountDescription,
        DiscountRate: DiscountRate,

        getSelectedRating: getSelectedRating,
        getSelectedDiscount: getSelectedDiscount,
        getSelectedLoading: getSelectedLoading,

        removeSelectedRating: removeSelectedRating,
        removeSelectedDiscount: removeSelectedDiscount,
        removeSelectedLoading: removeSelectedLoading,

        addNewRatings: addNewRatings,
        addNewLoading: addNewLoading,
        addNewDiscount: addNewDiscount,
        isNumberKey: isNumberKey
        //canDeactivate: canDeactivate


    }
    return vm;
});
