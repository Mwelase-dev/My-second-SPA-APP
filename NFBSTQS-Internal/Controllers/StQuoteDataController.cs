using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Http;
using NFBSTQS_Internal.Security;
using QsClasses;
using QsDataAccess.Repo;

namespace NFBSTQS_Internal.Controllers
{
    public class StQuoteDataController : ApiController
    {

        [HttpPut]
        public HttpResponseMessage UpdateDiscounts(Discount discount, Guid id)
        {
            var result = QsDataRepository.UpdateDiscounts(discount, id);
            return Request.CreateResponse(!result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed);
        }

        [HttpPut]
        public HttpResponseMessage UpdateRating(Rating rating, Guid id)
        {
            var result = QsDataRepository.UpdateRating(rating, id);
            return Request.CreateResponse(!result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed);
        }
         [HttpPost]
        public HttpResponseMessage ChangeQuoteStatus(Quote quote)
        {
            Guid quoteId = quote.QuoteId;// Guid.Parse(status.Split(' ').First());
            String quoteStatus = quote.QuoteStatus;//status.Split(' ').Last();
            var result = QsDataRepository.ChangeQuoteStatus(quoteId, quoteStatus);
   
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }
//-------------------------------------------------------------------------------------------------------------------
         [HttpGet]
         public HttpResponseMessage ReportQuote(Guid id)
         {
             var result = QsDataRepository.GetPdfQuoteReport(id);
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }

         [HttpPost]
         public HttpResponseMessage SaveExcess(Excess excess)
         {
             var result = QsDataRepository.SaveExcess(excess);
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }

         [HttpDelete]
         public HttpResponseMessage DeleteExcess(Guid id)
         {
             var result = QsDataRepository.DeleteExcess(id);
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }

         [HttpGet]
         public HttpResponseMessage GetAllExcesses()
         {
             var result = QsDataRepository.GetAllExcesses();
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }
         
         [HttpPost]
         public HttpResponseMessage SaveCommision(Commision com)
         {
             var result = QsDataRepository.SaveCommision(com);
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }

         [HttpDelete]
         public HttpResponseMessage DeleteCommision(Guid id)
         {
             var result = QsDataRepository.DeleteCommision(id);
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }

         [HttpGet]
         public HttpResponseMessage GetAllCommisions()
         {
             var result = QsDataRepository.GetAllCommsions();
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }
         
         [HttpGet]
         public HttpResponseMessage EmailReportQuote(Guid id)
         {
             var result = QsDataRepository.EmailReportQuote(id);
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }

         [HttpPost]
         public HttpResponseMessage Test(QuoteReportHtml markup)
         {
             var result = QsDataRepository.Test(markup.Markup);
             return Request.CreateResponse(HttpStatusCode.OK, result);
         }
         
        [HttpDelete]
        public HttpResponseMessage DeleteWarranty(Guid id)
        {
            var result = QsDataRepository.DeleteWarranty(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteSection(Guid id)
        {
            var result = QsDataRepository.DeleteSection(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpGet]
        public HttpResponseMessage GetWarantiesBySectionId(Guid id)
        {
            List<QuoteWarranties> waranties = QsDataRepository.GetWarantiesBySectionId(id);
            return Request.CreateResponse(HttpStatusCode.OK, waranties);
        }

        [HttpPut]
        public HttpResponseMessage UpdateWarrantyById(QuoteWarranties warranty)
        {
            var result = QsDataRepository.UpdateWarrantyById(warranty);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpGet]
        public HttpResponseMessage GetAllWarranties()
        {
            List<QuoteWarranties> warranties = QsDataRepository.GetAllWarranties();
            return Request.CreateResponse(!warranties.Any() ? HttpStatusCode.NotFound : HttpStatusCode.OK, warranties);
        }

        [HttpPost]
        public HttpResponseMessage AddWarranty(QuoteWarranties waranty)
        {
            var result = QsDataRepository.AddWarranty(waranty);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed,result);
        }

        [HttpGet]
        public HttpResponseMessage GetAllUserRoles(Guid id)
        {
            List<Role> roles = QsDataRepository.GetCurrentUserRoles(id);
            return Request.CreateResponse(!roles.Any() ? HttpStatusCode.NotFound : HttpStatusCode.OK, roles);
        }

        [HttpGet]
        public HttpResponseMessage GetQuoteHistory()
        {
            List<Quote> quoteHistory = QsDataRepository.GetQuoteHistory();
            return Request.CreateResponse(!quoteHistory.Any() ? HttpStatusCode.NotFound : HttpStatusCode.OK, quoteHistory);
        }

        [HttpGet]
        public HttpResponseMessage GetQuoteById(Guid id)
        {
            Quote quote = QsDataRepository.GetQuote(id);
            return Request.CreateResponse(quote != null ? HttpStatusCode.OK : HttpStatusCode.NotFound, quote);
        }

        [HttpPost]
        public HttpResponseMessage SaveRatings(Rating rating)
        {
            var result = QsDataRepository.SaveRating(rating);
            return Request.CreateResponse(!result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed);
        }

        [HttpPost]
        public HttpResponseMessage SaveDiscounts(Discount discount)
        {
            var result = QsDataRepository.SaveDiscounts(discount);
            return Request.CreateResponse(!result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed);
        }

        [HttpPost]
        public HttpResponseMessage AddSections(Section section)
        {
            var result = QsDataRepository.AddSection(section);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed, result);
        }

        [HttpPost]
        public HttpResponseMessage CreateNewQuote(Quote quote)
        {
            var result = QsDataRepository.CreateNewQuote(quote);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed);
        }

        [HttpGet]
        public HttpResponseMessage GetSections()
        {
            List<Section> quoteHistory = QsDataRepository.GetSections();
            return Request.CreateResponse(!quoteHistory.Any() ? HttpStatusCode.NotFound : HttpStatusCode.OK, quoteHistory);
        }

        [HttpGet]
        public HttpResponseMessage GetLoadings(Guid id)
        {
            List<Loading> quoteHistory = QsDataRepository.GetLoadings(id);
            return Request.CreateResponse(quoteHistory);
        }

        [HttpGet]
        public HttpResponseMessage GetDiscounts(Guid id)
        {
            List<Discount> quoteHistory = QsDataRepository.GetDiscounts(id);
            return Request.CreateResponse(quoteHistory);
        }

        [HttpGet]
        public HttpResponseMessage GetRatings(Guid id)
        {
            List<Rating> ratings = QsDataRepository.GetRatings(id);
            return Request.CreateResponse(ratings);
        }

        [HttpGet]
        public HttpResponseMessage GetAllRatings()
        {
            List<Rating> ratings = QsDataRepository.GetAllRatings();
            return Request.CreateResponse(!ratings.Any() ? HttpStatusCode.NotFound : HttpStatusCode.OK, ratings);
        }

        [HttpPost]
        public HttpResponseMessage CreateNewRating(Rating rating)
        {
            var result = QsDataRepository.CreateNewRating(rating);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }
         
        [HttpPost]
        public HttpResponseMessage CreateNewRole(Role role)
        {
            var result = QsDataRepository.CreateNewRole(role);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpPost]
        public HttpResponseMessage AssignRoleToUser(UserRole userRole)
        {
            var result = QsDataRepository.AssignRoleToUser(userRole);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpGet]
        public HttpResponseMessage GetAllUsers()
        {
            IList<User> result = QsDataRepository.GetAllUsers();
            return Request.CreateResponse(result.Any() ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }
        [HttpGet]
        public HttpResponseMessage GetAllUsersForFrontEnd()
        {
            IList<User> result = QsDataRepository.GetAllUsersForFrontEnd();
            return Request.CreateResponse(result.Any() ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpGet]
        public HttpResponseMessage GetAllRoles()
        {
            IList<Role> result = QsDataRepository.GetAllRoles();
            return Request.CreateResponse(result.Any() ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteUser(Guid id)
        {
            var result = QsDataRepository.DeleteUser(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteQuote(Guid id)
        {
            var result = QsDataRepository.DeleteQuote(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteRating(Guid id)
        {
            var result = QsDataRepository.DeleteRating(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteDiscount(Guid id)
        {
            var result = QsDataRepository.DeleteDiscount(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteLoading(Guid id)
        {
            var result = QsDataRepository.DeleteLoading(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpGet]
        public HttpResponseMessage GetItemsByQuote(Guid id)
        {
            IList<InsuredItem> result = QsDataRepository.GetItemsByQuote(id);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPut]
        public HttpResponseMessage UpdateRatingById(Rating rating)
        {
            var result = QsDataRepository.UpdateRatingById(rating);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpPut]
        public HttpResponseMessage AddItemToExistingQuote(InsuredItem item)
        {
            var result = QsDataRepository.AddItemToExistingQuote(item);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpPut]
        public HttpResponseMessage UpdateInsuredItemById(InsuredItem item)
        {
            var result = QsDataRepository.UpdateInsuredItemById(item);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpPut]
        public HttpResponseMessage UpdateUserAccountByUserId(User user)
        {
            var result = QsDataRepository.UpdateUserAccountByUserId(user);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpPost]
        public HttpResponseMessage CreateNewUser(User user)
        {
            var result = QsDataRepository.CreateNewUser(user, null);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }
         
        [HttpPost]
        public HttpResponseMessage AddNewFee(CompulsoryFee fee)
        {
            var result = QsDataRepository.AddNewFee(fee);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpPut]
        public HttpResponseMessage UpdateFeeById(CompulsoryFee fee)
        {
            var result = QsDataRepository.UpdateFeeById(fee);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteFeeById(Guid id)
        {
            var result = QsDataRepository.DeleteFeeById(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpGet]
        public HttpResponseMessage GetAllFees()
        {
            IList<CompulsoryFee> result = QsDataRepository.GetAllFees();
            return Request.CreateResponse(result.Any() ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpDelete]
        public HttpResponseMessage DeleteInsuredItemFromSavedQuote(Guid id)
        {
            var result = QsDataRepository.DeleteInsuredItemFromSavedQuote(id);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.NotFound, result);
        }

        [HttpPost]
        public HttpResponseMessage AddItemsToQuote(Quote quote)
        {
            var result = QsDataRepository.AddItemsToQuote(quote);
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed, result);
        }

        [HttpPost]
        public HttpResponseMessage GetLoadingRatesById(Guid id)
        {
           // List<Loading> result = QsDataRepository.GetLoadingRatesById(loadingId);
            var result = false;
            return Request.CreateResponse(result ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed, result);
        }
 
        [HttpPost]
        public HttpResponseMessage VerifyLoginCredentials()
        {
            var loggedInAccount = Thread.CurrentPrincipal;
 
            var user = (CustomPrincipal)loggedInAccount;
             
            User result = QsDataRepository.GetUserModel(/*Guid.Parse("CA05E16B-06A4-4423-9CFC-98E6FA3B820E")*/user.UserId);
        
            return Request.CreateResponse(result.FirstName != null ? HttpStatusCode.OK : HttpStatusCode.NonAuthoritativeInformation, result);
        }

        #region
        //[Route("Api/StQuoteData/VerifyLoginCredentials/{username}/{password}"), HttpGet]
        //public HttpResponseMessage VerifyLoginCredentials(string username, string password)
        //{
        //    User result = QsDataRepository.VerifyLoginCredentials(username, password);
        //    return Request.CreateResponse(result != null ? HttpStatusCode.OK : HttpStatusCode.NonAuthoritativeInformation, result);
        //}

        //[Route("Api/StQuoteData/VerifyLoginCredentials"), HttpPost]
        //[HttpPost]
        //public HttpResponseMessage VerifyLoginCredentials()
        //{
        //    var loggedIn = Thread.CurrentPrincipal;
        //    var user = (CustomPrincipal)loggedIn;


        //    User result = QsDataRepository.GetUserModel(user.UserId);
        //    return Request.CreateResponse(result != null ? HttpStatusCode.OK : HttpStatusCode.NonAuthoritativeInformation, result);
        //}



       
        #endregion

    }
}
