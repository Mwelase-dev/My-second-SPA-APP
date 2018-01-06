define(['knockout', 'services/datacontext', 'durandal/app','toastr'],
    function (ko, dtx, app, toastr) {
        var ratings = ko.observableArray();
      
        function activate() {
           return dtx.getAllRatings(ratings).then(function(result) {
               
           });
        }
         
        function getRatingDetailsToModify(rating) {
            var objectToSendForModification = JSON.stringify(rating);
            localStorage.setItem('TheRatingObject', objectToSendForModification);
            window.location.href = '#/editRating';
        }

        var removeRating = function (rating) {
            return app.showMessage('Are you sure you want remove this rating', 'Removing', ['Yes', 'No']).then(function(result) {
                if (result === "Yes") {
                    ratings.remove(rating);
                    dtx.deleteRating(rating.RatingId);
                    toastr.success("Rating deleted");
                }
            });
        }

        function formatCurrency(value) {
            var test = "R" + value.toFixed(2);
            return test;
        }

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(".");
        }
        var vm = {
            activate: activate,
            ratings: ratings,

            
        
            getRatingDetailsToModify: getRatingDetailsToModify,
            removeRating: removeRating,
            formatCurrency: formatCurrency,
            numberWithCommas: numberWithCommas

        };
        return vm;
    });