define(['plugins/http', 'knockout', 'toastr'],
    function (http, ko, toastr) {

        var createNewUser = function (operationResult, userModel) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(userModel);

            return $.ajax({
                type: 'POST',
                url: '/api/users/CreateNewUser',
                data: dataObject,
                traditional: true,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    operationResult = true;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var verifyLoginCredentials = function (userModel, userAuth) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(userAuth);

            return $.ajax({
                type: 'POST',
                url: '/api/users/Authenticate',
                data: dataObject,
                traditional: true,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    userModel(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getUserModel = function (userModel, userAuth, token) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(userAuth);

            return $.ajax({
                type: 'POST',
                url: '/api/data/VerifyLoginCredentials',
                data: dataObject,
                traditional: true,
                dataType: 'json',
                headers: { 'X-Token': token },
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    userModel(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getToken = function () {
            return sessionStorage.getItem('UserAuthToken');
        }

        var doWork = function () {

        }

        var getQuotes = function (quotes) {
            jQuery.support.cors = true;
            return $.ajax({
                url: '/api/data/GetQuoteHistory',
                type: 'GET',
                data: JSON.stringify(quotes),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    quotes(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var updateUserAccountByUserId = function (userTobBeUpdated) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(userTobBeUpdated);

            return $.ajax({
                type: 'POST',
                url: '/api/users/CreateNewUser',
                data: dataObject,
                traditional: true,
                //headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getAWarranties = function (waranties) {
            jQuery.support.cors = true;
            return $.ajax({
                url: '/api/data/GetAllWarranties',
                type: 'GET',
                data: JSON.stringify(waranties),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',

                success: function (data) {
                    waranties(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var addWarranty = function (waranty) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(waranty);
            return $.ajax({
                type: 'POST',
                url: '/api/data/AddWarranty',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    return;
                },
                //error: function (errorData) {
                //    toastr.error(errorData.responseText);
                //}
            });
        }

        var getAllRatings = function (ratings) {

            jQuery.support.cors = true;
            return $.ajax({
                url: '/api/data/GetAllRatings',
                type: 'GET',
                data: JSON.stringify(ratings),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    ratings(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var addRating = function (rating) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(rating);

            return $.ajax({
                type: 'POST',
                url: '/api/data/CreateNewRating',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (errorData) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var addSections = function (sections) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(ko.toJS(sections[0]), null, 2);
            return $.ajax({
                type: 'POST',
                url: '/api/data/AddSections',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    return;
                },
                //error: function (errorData) {
                //    toastr.error(errorData.responseText);
                //}
            });
        }

        var addQuote = function (quote) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(ko.toJS(quote[0]), null, 2);

            $.ajax({
                type: 'POST',
                url: '/api/data/CreateNewQuote',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {

                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getAllUsers = function (users) {
            jQuery.support.cors = true;
            return $.ajax({
                url: '/api/data/GetAllUsers',
                type: 'GET',
                data: JSON.stringify(users),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    users(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getAllUsersForFrontEnd = function (users) {
            jQuery.support.cors = true;
            return $.ajax({
                url: '/api/data/GetAllUsersForFrontEnd',
                type: 'GET',
                data: JSON.stringify(users),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    users(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var createNewRole = function (roleModel) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(roleModel);

            $.ajax({
                type: 'POST',
                url: '/api/data/CreateNewRole',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var deleteUser = function (userId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteUser/' + userId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                }
            });
        }

        var deleteQuote = function (quoteId) {
            jQuery.support.cors = true;
            $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteQuote/' + quoteId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var assignUserToRole = function (userRoleModel) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(userRoleModel);

            $.ajax({
                type: 'POST',
                url: '/api/data/AssignRoleToUser',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var deleteRating = function (ratingId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteRating/' + ratingId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var deleteDiscount = function (discountId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteDiscount/' + discountId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var deleteLoading = function (loadingId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteLoading/' + loadingId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var deleteInsuredItemFromSavedQuote = function (itemId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteInsuredItemFromSavedQuote/' + itemId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var updateWarrantyById = function (warrantyModel) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(warrantyModel);

            return $.ajax({
                type: 'PUT',
                url: '/api/data/UpdateWarrantyById',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                //error: function (errorData) {
                //    toastr.error(errorData.responseText);
                //}
            });
        }

        var updateRatingById = function (ratingModel) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(ratingModel);

            return $.ajax({
                type: 'PUT',
                url: '/api/data/UpdateRatingById',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var addItemToExistingQuote = function (itemObject) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(itemObject);

            $.ajax({
                type: 'PUT',
                url: '/api/data/AddItemToExistingQuote',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var updateItemById = function (itemTobBeUpdated) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(itemTobBeUpdated);

            $.ajax({
                type: 'PUT',
                url: '/api/data/UpdateInsuredItemById',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var addFee = function (compFee) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(compFee);

            return $.ajax({
                type: 'POST',
                url: '/api/data/AddNewFee',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                //error: function (errorData) {
                //    toastr.error(errorData.responseText);
                //}
            });
        }

        var getAllFees = function (fees) {
            jQuery.support.cors = true;
            $.ajax({
                url: '/api/data/GetAllFees',
                type: 'GET',
                data: JSON.stringify(fees),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    fees(data);
                    return fees();
                },
                error: function () {
                    alert("failed to request access");
                }
            });
            //return $.getJSON('/api/data/GetAllFees').done();
        }

        var updateFeeById = function (feeToBeUpdated) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(feeToBeUpdated);

            return $.ajax({
                type: 'PUT',
                url: '/api/data/UpdateFeeById',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                //error: function (errorData) {
                //    toastr.error(errorData.responseText);
                //}
            });
        }

        var deleteFeeById = function (feeId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteFeeById/' + feeId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var addItemsToQuote = function (dataObject) {
            jQuery.support.cors = true;
            var quote = JSON.stringify(ko.toJS(dataObject), null, 2);
            //var quote = JSON.stringify(dataObject);

            return $.ajax({
                type: 'POST',
                url: '/api/data/AddItemsToQuote',
                data: quote,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var changeQuoteStatus = function (quote) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(quote);
            //var datayyyy = JSON.stringify(quoteId + "*" + status);
            return $.ajax({
                type: 'POST',
                url: '/api/data/ChangeQuoteStatus/',
                traditional: true,
                data: dataObject,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });

        }

        var deleteSection = function (sectionId) {
            jQuery.support.cors = true;
            $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteSection/' + sectionId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        };

        var deleteWarranty = function (warrantyId) {
            jQuery.support.cors = true;
            $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteWarranty/' + warrantyId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getAllWarranties = function (sectionId) {
            // return $.getJSON('/api/data/GetWarantiesBySectionId/' + sectionId).done();
            jQuery.support.cors = true;
            return $.ajax({
                type: 'GET',
                url: '/api/data/GetWarantiesBySectionId/' + sectionId,
                data: sectionId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });


        }

        var getSectionsForDropdown = function () {
            // return $.getJSON('/api/data/GetSections').done();

            return $.ajax({
                type: 'GET',
                url: '/api/data/GetSections',
                data: null,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });


        }

        var getAllRoles = function () {
            //return $.getJSON('/api/data/GetAllRoles').done();

            return $.ajax({
                type: 'GET',
                url: '/api/data/GetAllRoles',
                data: null,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });

        }

        var getItemsByQuoteId = function (quoteId) {
            //return $.getJSON('/api/data/GetItemsByQuote/' + quoteId).done();
            return $.ajax({
                type: 'GET',
                url: '/api/data/GetItemsByQuote/' + quoteId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error("No items were found.");
                }
            });

        }
         
        var getLoadingRatesById = function (loadingId) {
            //return $.getJSON('/api/data/GetLoadingRatesById/' + loadingId).done();

            return $.ajax({
                type: 'GET',
                url: '/api/data/GetLoadingRatesById/' + loadingId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getAllFeesForQuote = function (fees) {
            //return $.getJSON('/api/data/GetAllFees').done();

            return $.ajax({
                type: 'GET',
                url: '/api/data/GetAllFees',
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    fees(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        };

        var getCurrentUserRoles = function (userRoles, userRoleId) {
            //return $.getJSON('/api/data/GetCurrentUserRoles/' + userRoleId).done();

            return $.ajax({
                type: 'GET',
                url: '/api/data/GetAllUserRoles/' + userRoleId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    userRoles(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });

        }

        var getSections = function () {
            // return $.getJSON('/api/data/GetSections').done();
            return $.ajax({
                type: 'GET',
                url: '/api/data/GetSections',
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var getRatings = function (sectionId) {
            // return $.getJSON('/api/data/GetRatings/' + sectionId).done();
            return $.ajax({
                type: 'GET',
                url: '/api/data/GetRatings/' + sectionId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });

        }

        var getDiscounts = function (sectionId) {
            //return $.getJSON('/api/data/GetDiscounts/' + sectionId).done();
            return $.ajax({
                type: 'GET',
                url: '/api/data/GetDiscounts/' + sectionId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });

        }

        var getLoadings = function (sectionId) {
            //return $.getJSON('/api/data/GetLoadings/' + sectionId).done();
            return $.ajax({
                type: 'GET',
                url: '/api/data/GetLoadings/' + sectionId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });

        }

        var reportQuote = function (pdf,quoteId) {
           return $.ajax({
                type: 'GET',
                url: '/api/data/ReportQuote/' + quoteId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    return pdf(data);
                    //window.open("data:application/pdf," + escape(data));
                    //var pdfWin = window.open("data:application/pdf; " + data, '', 'height=650,width=840');
                    //window.open("data:application/pdf;base64, " + data);

                    //window.open("data:application/pdf," + escape(data));
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
           });


        }

        var emailReportQuote = function ( quoteId) {
            return $.ajax({
                type: 'GET',
                url: '/api/data/EmailReportQuote/' + quoteId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    return;
                    //window.open("data:application/pdf," + escape(data));
                    //var pdfWin = window.open("data:application/pdf; " + data, '', 'height=650,width=840');
                    //window.open("data:application/pdf;base64, " + data);

                    //window.open("data:application/pdf," + escape(data));
                },
                error: function (errorData) {
                    toastr.error("Email not sent");
                }
            });


        }
         
        var reportQuote2 = function (quote) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(quote);

            $.ajax({
                type: 'POST',
                url: '/api/data/Test',
                data: dataObject,
                traditional: true,
                
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {

                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }
    
        var deleteExcess = function (excessId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteExcess/' + excessId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }
        var saveExcess = function (excess) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(excess);

            return $.ajax({
                type: 'POST',
                url: '/api/data/SaveExcess',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (errorData) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }
        var getAllExcess = function (excess) {

            jQuery.support.cors = true;
            return $.ajax({
                url: '/api/data/GetAllExcesses',
                type: 'GET',
                data: JSON.stringify(excess),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    excess(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }


        var deleteCommision = function (commsionId) {
            jQuery.support.cors = true;
            return $.ajax({
                type: 'DELETE',
                url: '/api/data/DeleteCommision/' + commsionId,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (data) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }
        var saveCommision = function (com) {
            jQuery.support.cors = true;
            var dataObject = JSON.stringify(com);

            return $.ajax({
                type: 'POST',
                url: '/api/data/SaveCommision',
                data: dataObject,
                traditional: true,
                headers: { 'X-Token': getToken() },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

                success: function (errorData) {
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }
        var getAllCommisions = function (com) {

            jQuery.support.cors = true;
            return $.ajax({
                url: '/api/data/GetAllCommisions',
                type: 'GET',
                data: JSON.stringify(com),
                traditional: true,
                headers: { 'X-Token': getToken() },
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    com(data);
                    return;
                },
                error: function (errorData) {
                    toastr.error(errorData.responseText);
                }
            });
        }

        var vm = {
            getQuotes: getQuotes,
            getRatings: getRatings,
            getSectionsForDropdown: getSectionsForDropdown,
            addSections: addSections,
            addQuote: addQuote,
            addRating: addRating,
            getLoadings: getLoadings,
            getDiscounts: getDiscounts,
            getSections: getSections,
            getAllRatings: getAllRatings,
            addItemToExistingQuote: addItemToExistingQuote,
            getAllUsers: getAllUsers,
            getAllUsersForFrontEnd: getAllUsersForFrontEnd,
            getAllRoles: getAllRoles,
            createNewUser: createNewUser,
            createNewRole: createNewRole,
            assignUserToRole: assignUserToRole,
            deleteUser: deleteUser,
            deleteQuote: deleteQuote,
            deleteRating: deleteRating,
            deleteDiscount: deleteDiscount,
            deleteLoading: deleteLoading,
            deleteInsuredItemFromSavedQuote: deleteInsuredItemFromSavedQuote,
            getItemsByQuoteId: getItemsByQuoteId,
            updateRatingById: updateRatingById,
            updateWarrantyById: updateWarrantyById,
            updateItemById: updateItemById,
            updateUserAccountByUserId: updateUserAccountByUserId,
            verifyLoginCredentials: verifyLoginCredentials,
            addFee: addFee,
            getAllFees: getAllFees,
            updateFeeById: updateFeeById,
            deleteFeeById: deleteFeeById,
            getAllFeesForQuote: getAllFeesForQuote,
            addItemsToQuote: addItemsToQuote,
            getLoadingRatesById: getLoadingRatesById,
            getCurrentUserRoles: getCurrentUserRoles,
            addWarranty: addWarranty,
            getAllWarranties: getAllWarranties,
            getAWarranties: getAWarranties,
            changeQuoteStatus: changeQuoteStatus,
            deleteSection: deleteSection,
            deleteWarranty: deleteWarranty,
            getUserModel: getUserModel,
            reportQuote: reportQuote,
            reportQuote2: reportQuote2,
            emailReportQuote: emailReportQuote,
            deleteExcess: deleteExcess,
            saveExcess: saveExcess,
            getAllExcess: getAllExcess,
            getAllCommisions: getAllCommisions,
            saveCommision : saveCommision,
            deleteCommision : deleteCommision

        };

        return vm;
    });