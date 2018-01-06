define(['knockout', 'services/datacontext', 'viewmodels/newQuote', 'durandal/app', 'toastr','moment'],
    function (ko, datacontext, nq, app, toaster,moment) {
        var quotes = ko.observableArray();
        var query = ko.observable("");
        var isPrinting = false;
        var pdf = ko.observableArray();

        var activate = function () {
            return datacontext.getQuotes(quotes).then(function (result) {
                if (!result) {
                    toaster.warning("Please log in to continue");
                }
            });
        };

        var removeQuote = function (quote) {
            return app.showMessage('Are you sure you want remove this quote', 'Removing', ['Yes', 'No']).then(function (result) {
                if (result === "Yes") {
                    quotes.remove(quote);
                    datacontext.deleteQuote(quote.QuoteId);
                    window.location.href = '#/dashboard';
                }
            });
        }

        var getMoreQuoteDetails = function (quote) {
            var objectToSend = JSON.stringify(quote);
            localStorage.setItem('TheQuoteObject', objectToSend);
            //window.location.href = '#/quote';
            window.location.href = '#/editQuote';
        }

        var createNewQuote = function () {
            //window.location.href = '#/quote';
            //window.location.href = '#/newQuote';
            window.location.href = '#/editQuote';
        }

        function open(strData, strMimeType) {
            var newdata = "data:" + strMimeType + ";base64," + escape(strData);
            //To open in new window
            window.open(newdata, "_blank");
            return true;
        }

        function download(strData, strFileName, strMimeType, isPrinting) {
            var D = document, A = arguments, a = D.createElement("a"),
                 d = A[0], n = A[1], t = A[2] || "application/pdf";

            var newdata = "data:" + strMimeType + ";base64," + escape(strData);

            //build download link:
            a.href = newdata;

            if ('download' in a) {
                a.setAttribute("download", n);
                a.innerHTML = "downloading...";
                D.body.appendChild(a);
                setTimeout(function () {
                    var e = D.createEvent("MouseEvents");

                    e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
                );
                    a.dispatchEvent(e);
                    D.body.removeChild(a);
                }, 66);

                if (isPrinting) {
                    open(strData, strMimeType);
                }


                return true;
            };

        }

        var print = function (quote) {
            //return datacontext.reportQuote(pdf, quote.QuoteId).then(function (result) {
                //open(pdf(), 'application/pdf');

                var objectToSend = JSON.stringify(quote);
                localStorage.setItem('TheQuoteObjectToBePrinted', objectToSend);
                window.location.href = '#/reports';
            //});
        }

        var email = function (quote) {
            return datacontext.emailReportQuote(quote.QuoteId).then(function (result) {
                if (result) {
                    toaster.success("Email has been sent");
                } else {
                    toaster.danger("Error, Email not sent");
                }

            });
        }


        //Do not delete
        //var email = function (quote) {
        //    return datacontext.reportQuote(pdf, quote.QuoteId).then(function (result) {
        //        if (result) {
        //            download(pdf(), quote.ClientName, 'application/pdf');
        //        }
        //        var objectToSend = JSON.stringify(quote);
        //        localStorage.setItem('TheQuoteObjectToBePrinted', objectToSend);
        //        window.location.href = '#/reports';
        //    });
        //}
        //Do not delete

        var saveQuotePdf = function (quote) {
            return datacontext.reportQuote(pdf, quote.QuoteId).then(function (result) {
                if (result) {
                    isPrinting = false;
                    download(pdf(), quote.ClientName, 'application/pdf', isPrinting);
                }

            });
        }

        var setQuoteStatuToRejected = function (quote) {
            quote.QuoteStatus = "Not Taken Up";
            return datacontext.changeQuoteStatus(quote).then(function () {
                toaster.success("Quote status changed to rejected");
                activate();
            });
        }

        var setQuoteStatuToAccepted = function (quote) {
            quote.QuoteStatus = "Accepted";
            return datacontext.changeQuoteStatus(quote).then(function () {
                toaster.success("Quote status changed to accepted");
                activate();
            });
        }

        var sortByName = function () {
            this.quotes.sort(function (a, b) {
                return a.ClientName < b.ClientName ? -1 : 1;
            });
        };//sortDate

        var sortByDate = function () {
            this.quotes.sort(function (a, b) {
                return a.QuoteDate < b.QuoteDate ? -1 : 1;
            });
        };

        var sortByStatus = function () {
            this.quotes.sort(function (a, b) {
                return a.QuoteStatus < b.QuoteStatus ? -1 : 1;
            });
        };

        var computedPageLinks = ko.computed(function () {
            return ko.utils.arrayFilter(quotes(), function (item) {
                return item.ClientName.toLowerCase().indexOf(query().toLowerCase()) >= 0 || item.QuoteStatus.toLowerCase().indexOf(query().toLowerCase()) >= 0 || item.UnderWriter.toLowerCase().indexOf(query().toLowerCase()) >= 0 || item.QuoteDate.toLowerCase().indexOf(query().toLowerCase()) >= 0;
            });
        });

        var vm = {
            activate: activate,
            quotes: quotes,

            removeQuote: removeQuote,
            getMoreQuoteDetails: getMoreQuoteDetails,
            createNewQuote: createNewQuote,
            print: print,
            email: email,
            saveQuotePdf: saveQuotePdf,

            setQuoteStatuToAccepted: setQuoteStatuToAccepted,
            setQuoteStatuToRejected: setQuoteStatuToRejected,


            sortByStatus: sortByStatus,
            sortByName: sortByName,
            sortByDate: sortByDate,
            query: query,
            computedPageLinks: computedPageLinks

        };

        return vm;
    });