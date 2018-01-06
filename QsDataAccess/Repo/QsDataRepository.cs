using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using CsvHelper;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using QsClasses;
using Section = QsClasses.Section;

namespace QsDataAccess.Repo
{
    public class QsDataRepository
    {
        #region Users

        public static User VerifyLoginCredentials(string userName, string password)
        {
            return DbContext.VerifyLoginCredentials(userName, password);
        }

        public static List<Role> GetCurrentUserRoles(Guid userRoleId)
        {
            return DbContext.GetCurrentUserRoles(userRoleId);
        }

        public static bool CreateNewUser(User user, byte[] salt)
        {
            if (user.UserId == Guid.Empty)
            {
                return DbContext.CreateNewUser(user, salt);
            }
            else
            {
                return DbContext.UpdateUserAccountByUserId(user, salt);
            }
        }

        public static bool CreateNewRole(Role role)
        {
            return DbContext.CreateNewRole(role);
        }

        public static bool AssignRoleToUser(UserRole userRole)
        {
            return DbContext.UpdateUserRole(userRole);

        }

        public static IList<User> GetAllUsers()
        {
            return DbContext.GetAllUsers();
        }

        public static IList<User> GetAllUsersForFrontEnd()
        {
            return DbContext.GetAllUsersForFrontEnd();
        }

        public static bool DeleteUser(Guid userId)
        {
            return DbContext.DeleteUser(userId);
        }

        public static IList<Role> GetAllRoles()
        {
            return DbContext.GetAllRoles();
        }

        #endregion

        #region Data

        #region Users

        //public static User VerifyLoginCredentials(User user)
        //{
        //    return DbContext.VerifyLoginCredentials(user);
        //}

        //public static List<Role> GetCurrentUserRoles(Guid userRoleId)
        //{
        //    return DbContext.GetCurrentUserRoles(userRoleId);
        //}

        //public static bool CreateNewUser(User user)
        //{
        //    return DbContext.CreateNewUser(user);
        //}


        //public static bool CreateNewRole(Role role)
        //{
        //    return DbContext.CreateNewRole(role);
        //}

        //public static bool AssignRoleToUser(UserRole userRole)
        //{
        //    return DbContext.UpdateUserRole(userRole);

        //}

        //public static IList<User> GetAllUsers()
        //{
        //    return DbContext.GetAllUsers();
        //}

        //public static bool DeleteUser(Guid userId)
        //{
        //    return DbContext.DeleteUser(userId);
        //}

        //public static IList<Role> GetAllRoles()
        //{
        //    return DbContext.GetAllRoles();
        //}

        #endregion

        public static List<Quote> GetQuoteHistory()
        {
            List<Quote> quotes = DbContext.GetQuoteHistory();

            if (quotes.Any())
            {
                foreach (Quote quote in quotes)
                {
                    //Update quotes status
                    if (quote.QuoteDate.AddDays(30) < DateTime.Now)
                    {
                        DbContext.UpdateQuoteStatusToExpired(quote);
                    }
                }
            }


            return quotes;
        }

        public static List<Rating> GetRatings(Guid sectionId)
        {
            return DbContext.GetRatings(sectionId);
        }

        public static Quote GetQuote(Guid quoteId)
        {
            return DbContext.GetQuoteById(quoteId);
        }

        public static bool SaveRating(Rating rating)
        {
            return DbContext.SaveRating(rating);
        }

        public static bool UpdateRating(Rating rating, Guid id)
        {
            return DbContext.UpdateRating(rating);
        }

        public static bool SaveDiscounts(Discount discount)
        {
            return DbContext.SaveDiscounts(discount);
        }

        public static bool UpdateDiscounts(Discount discount, Guid id)
        {
            return DbContext.UpdateDiscounts(discount);
        }

        public static bool AddSection(Section section)
        {
            //here i'll disect the whole object into different objects 
            //Ill also assign Id's and Rec Id's
            if (section.SectionId == Guid.Empty)
            {
                var sectionId = Guid.NewGuid();
                var ratings = section.Ratings;
                var discounts = section.Discounts;
                var loadings = section.Loadings;

                try
                {
                    foreach (Rating rating in ratings)
                    {
                        DbContext.AddRatings(rating, sectionId);
                    }
                    foreach (Discount discount in discounts)
                    {
                        DbContext.AddDiscounts(discount, sectionId);
                    }
                    foreach (Loading loading in loadings)
                    {
                        DbContext.AddLoadings(loading, sectionId);
                    }

                    section.SectionId = sectionId;
                    DbContext.AddSection(section);
                }
                catch
                {

                    return false;
                }
                return true;
            }
            else
            {
                var ratings = section.Ratings;
                var discounts = section.Discounts;
                var loadings = section.Loadings;

                try
                {
                    foreach (Rating rating in ratings)
                    {
                        if (rating.RatingId == Guid.Empty)
                        {
                            DbContext.AddRatings(rating, section.SectionId);
                        }
                        else
                        {
                            DbContext.UpdateRating(rating);
                        }
                    }
                    foreach (Discount discount in discounts)
                    {
                        if (discount.DiscountId == Guid.Empty)
                        {
                            DbContext.AddDiscounts(discount, section.SectionId);
                        }
                        else
                        {
                            DbContext.UpdateDiscounts(discount);
                        }

                    }
                    foreach (Loading loading in loadings)
                    {
                        if (loading.LoadingId == Guid.Empty)
                        {
                            DbContext.AddLoadings(loading, section.SectionId);
                        }
                        else
                        {
                            DbContext.UpdateLoading(loading);
                        }

                    }


                    DbContext.UpdateSection(section);
                }
                catch
                {

                    return false;
                }
                return true;
            }

        }

        public static List<Loading> GetLoadings(Guid sectionId)
        {
            return DbContext.GetLoadings(sectionId);
        }

        public static List<Discount> GetDiscounts(Guid sectionId)
        {
            return DbContext.GetDiscounts(sectionId);
        }

        public static List<Section> GetSections()
        {
            return DbContext.GetSections();
        }

        public static List<Rating> GetAllRatings()
        {
            return DbContext.GetAllRatings();
        }

        public static bool CreateNewRating(Rating rating)
        {
            return DbContext.CreateNewRating(rating);
        }

        public static bool DeleteQuote(Guid quoteId)
        {
            return DbContext.DeleteQuote(quoteId);
        }

        public static IList<InsuredItem> GetItemsByQuote(Guid quoteId)
        {
            var listOfItems = DbContext.GetItemsByQuote(quoteId).OrderBy(x=>x.SectionDisplay).ToList();

            return listOfItems;
        }

        public static bool DeleteRating(Guid ratingId)
        {
            return DbContext.DeleteRating(ratingId);
        }

        public static bool DeleteDiscount(Guid ratingId)
        {
            return DbContext.DeleteDiscount(ratingId);
        }

        public static bool DeleteLoading(Guid ratingId)
        {
            return DbContext.DeleteLoading(ratingId);
        }

        public static bool DeleteInsuredItemFromSavedQuote(Guid itemId)
        {
            return DbContext.DeleteInsuredItemFromSavedQuote(itemId);
        }

        public static bool UpdateRatingById(Rating rating)
        {
            return DbContext.UpdateRatingById(rating);
        }

        public static bool AddItemToExistingQuote(InsuredItem item)
        {
            return DbContext.AddItemToExistingQuote(item);
        }

        public static bool UpdateInsuredItemById(InsuredItem item)
        {
            return DbContext.UpdateInsuredItemById(item);
        }

        public static bool UpdateUserAccountByUserId(User user)
        {
            return DbContext.UpdateUserAccountByUserId(user, null);
        }

        //public static User VerifyLoginCredentials(string userName, string password)
        //{
        //    return DbContext.VerifyLoginCredentials(userName, password);
        //}

        public static bool AddNewFee(CompulsoryFee fee)
        {
            return DbContext.AddNewFee(fee);
        }

        public static bool UpdateFeeById(CompulsoryFee fee)
        {
            return DbContext.UpdateFeeById(fee);
        }

        public static bool DeleteFeeById(Guid fee)
        {
            return DbContext.DeleteFeeById(fee);
        }

        public static IList<CompulsoryFee> GetAllFees()
        {
            return DbContext.GetAllFees();
        }
         
        public static bool AddItemsToQuote(Quote quote)
        {
            try
            {

                if (quote.QuoteId == Guid.Empty)
                {
                    quote.QuoteId = Guid.NewGuid();
                }
                if (quote.ClientId == Guid.Empty)
                {
                    quote.ClientId = Guid.NewGuid();
                }



                #region Quote Details
                quote.ClientName = String.Format("{0}", quote.ClientName);
                DbContext.CreateNewQuote(quote);
                #endregion

                #region Client Details
                var client = new Client();
                client.ClientId = quote.ClientId;
                client.ClientFirstName = quote.ClientName;
                client.ClientLastName = quote.ClientName;
                client.ContactNumer = quote.ContactNumber;
                DbContext.SaveClient(client);
                #endregion


                #region Insured Item Details
                foreach (InsuredItem insuredItem in quote.InsuredItems)
                {
                    #region Insured Item
                    if (insuredItem.ItemId == Guid.Empty)
                    {
                        insuredItem.ItemId = Guid.NewGuid();
                    }
                    DbContext.SaveInsuredItem(insuredItem, quote.QuoteId, quote.ClientId);
                    #endregion

                    DbContext.DeleteItemLoadings(insuredItem.ItemId);
                    foreach (var itemLoading in insuredItem.InsuredItemLoadings)
                    {
                        DbContext.SaveItemLoadings(itemLoading, insuredItem.ItemId);
                    }

                    DbContext.DeleteItemDiscounts(insuredItem.ItemId);
                    foreach (var itemDiscount in insuredItem.InsuredItemDiscounts)
                    {
                        DbContext.SaveItemDiscounts(itemDiscount, insuredItem.ItemId);
                    }

                    DbContext.DeleteItemWarranties(insuredItem.ItemId);
                    foreach (Guid quoteWarranty in insuredItem.QuoteWarranties)
                    {
                        DbContext.SaveItemWarranties(quoteWarranty, insuredItem.ItemId);
                    }
                }
                #endregion

                CreateReport(quote.QuoteId);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
         
        public static bool CreateNewQuote(Quote quote)
        {
            try
            {
                var clientId = Guid.NewGuid();
                var quoteId = Guid.NewGuid();

                var client = new Client();
                var insuredItems = quote.InsuredItems;

                foreach (InsuredItem insuredItem in insuredItems)
                {
                    var itemId = Guid.NewGuid();
                    insuredItem.ItemId = itemId;

                    DbContext.SaveInsuredItem(insuredItem, quoteId, clientId);
                    foreach (var itemLoading in insuredItem.InsuredItemLoadings)
                    {
                        DbContext.SaveItemLoadings(itemLoading, insuredItem.ItemId);
                    }
                    foreach (var itemDiscount in insuredItem.InsuredItemDiscounts)
                    {
                        DbContext.SaveItemDiscounts(itemDiscount, insuredItem.ItemId);
                    }
                }
                client.ClientFirstName = quote.ClientName;
                client.ClientLastName = quote.ClientName;
                client.ContactNumer = quote.ContactNumber;
                client.ClientId = clientId;
                DbContext.SaveClient(client);

                quote.QuoteId = quoteId;
                quote.ClientId = clientId;
                quote.ClientName = quote.ClientName;
                DbContext.CreateNewQuote(quote);
            }
            catch
            {
                return false;
            }

            return true;
        }

        public static bool AddWarranty(QuoteWarranties waranty)
        {
            return DbContext.AddWarranty(waranty);
        }

        public static List<QuoteWarranties> GetAllWarranties()
        {
            return DbContext.GetAllWarranties();
        }

        public static bool UpdateWarrantyById(QuoteWarranties warranty)
        {
            return DbContext.UpdateWarrantyById(warranty);
        }

        public static List<QuoteWarranties> GetWarantiesBySectionId(Guid sectionId)
        {
            return DbContext.GetWarantiesBySectionId(sectionId);
        }

        public static bool ChangeQuoteStatus(Guid quoteId, string status)
        {
            return DbContext.ChangeQuoteStatus(quoteId, status);

        }

        public static bool DeleteSection(Guid sectionId)
        {
            return DbContext.DeleteSection(sectionId);
        }

        public static bool DeleteWarranty(Guid warrantyId)
        {
            return DbContext.DeleteWarranty(warrantyId);
        }

        #endregion

        public static User GetUserModel(Guid userId)
        {
            return DbContext.GetUserModel(userId);
        }

        public static bool CreateReport(Guid quoteId)
        {
            #region
            try
            {
                byte[] thePdfReport;
                var quote = DbContext.GetQuoteHistory().First(x => x.QuoteId.Equals(quoteId));
                var items = DbContext.GetItemsByQuote(quoteId).Where(x => x.QuoteId.Equals(quoteId)).OrderBy(x=>x.SectionDisplay).ToList();
                var fees = DbContext.GetAllFees();

                string appRootDir2 = AppDomain.CurrentDomain.BaseDirectory;

                using (MemoryStream ms = new MemoryStream())
                {

                    #region
                    Document doc = new Document(PageSize.A4, 0, 0, 0, 0);

                    //PdfWriter.GetInstance(doc, new FileStream(appRootDir + quote.ClientName + ".pdf", FileMode.Create));
                    PdfWriter writer = PdfWriter.GetInstance(doc, ms);

                    PdfAction action = new PdfAction(PdfAction.PRINTDIALOG);
                    writer.SetOpenAction(action);

                    //PdfWriter.GetInstance(doc, new FileStream(appRootDir2 + "Yahne" + ".pdf", FileMode.Create));
                    doc.Open();

                    #region Logos/ Heading

                    const string hollardImagePath = "https://quotes.nfbst.co.za/images/Hollard.png";
                    const string nfbImagepath = "https://quotes.nfbst.co.za/images/NFB_300_147_90.jpg";
                    const string fiaImagepath = "https://quotes.nfbst.co.za/images/Fia.png";
                    const string labelImagepath = "https://quotes.nfbst.co.za/images/quote.png";

                    Image gif1 = Image.GetInstance(hollardImagePath);
                    gif1.ScaleToFit(40f, 40f);
                    Image gif2 = Image.GetInstance(nfbImagepath);
                    gif2.ScaleToFit(80f, 80f);
                    Image gif3 = Image.GetInstance(fiaImagepath);
                    gif3.ScaleToFit(40f, 40f);
                    Image gif4 = Image.GetInstance(labelImagepath);
                    gif3.ScaleToFit(40f, 40f);

                    PdfPTable logosTable = new PdfPTable(3);
                    logosTable.DefaultCell.Border = Rectangle.NO_BORDER;

                    PdfPCell logoscell = new PdfPCell(new Phrase());

                    logoscell.Border = 0;
                    logoscell.Colspan = 3;
                    logoscell.HorizontalAlignment = 1; //0=Left, 1=Centre, 2=Right

                    logosTable.AddCell(gif1);
                    logosTable.AddCell(gif2);
                    logosTable.AddCell(gif3);
                    logosTable.AddCell("");
                    logosTable.AddCell(gif4);
                    logosTable.AddCell("");

                    doc.Add(Chunk.NEWLINE);



                    doc.Add(logosTable);

                    #endregion

                    #region Personal info

                    PdfPTable personalInfoTable = new PdfPTable(1);
                    logosTable.DefaultCell.Border = Rectangle.NO_BORDER;

                    PdfPCell personalInfcell = new PdfPCell(new Phrase());

                    personalInfcell.Border = 0;
                    personalInfcell.Colspan = 3;
                    personalInfcell.HorizontalAlignment = 1; //0=Left, 1=Centre, 2=Right

                    personalInfoTable.AddCell("The Insured" + " \t: " + quote.ClientName);
                    personalInfoTable.AddCell("Contact number" + " \t: " + quote.ContactNumber);
                    personalInfoTable.AddCell("Risk Address" + " \t: " + "");
                    personalInfoTable.AddCell("Period of Insurance" + " \t: " + "Quotation is Valid for 30 days");


                    doc.Add(personalInfoTable);

                    #endregion
                     
                    #region Items

                    BaseFont bfTimes = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, false);
                    Font times = new Font(bfTimes, 12, Font.NORMAL, BaseColor.BLACK);

                    PdfPTable itemsTable = new PdfPTable(7);
                    itemsTable.DefaultCell.Border = Rectangle.NO_BORDER;
                    PdfPCell itemsCell = new PdfPCell(new Phrase());



                    itemsTable.AddCell("Section");
                    itemsTable.AddCell("Discounts");
                    itemsTable.AddCell("Loadings");
                    itemsTable.AddCell("Warranties");
                    itemsTable.AddCell("Comments");
                    itemsTable.AddCell("Sum Insured");
                    itemsTable.AddCell("Monthly Premium");



                    //doc.Add(new Paragraph("Section Discounts Loadings Warranties Comments Sum Insured Monthly Premium"));
                    doc.Add(itemsTable);

                    #endregion

                    #region Excesses

                    //
                    //

                    #endregion

                    #region Commsions

                    //
                    //

                    #endregion

                    thePdfReport = ms.GetBuffer();
                    doc.Close();

                    SavePdfQuoteReport(thePdfReport, quote.QuoteId);

                    #endregion
                }
                return true;
            }
            catch (Exception exc)
            {
                return false;
            }

            #endregion
        }

        private static bool SavePdfQuoteReport(byte[] quoteReport, Guid quoteId)
        {
            return DbContext.SavePdf(quoteReport, quoteId);
        }

        //public static byte[] GetPdfQuoteReport(Guid quoteId)
        //{
        //    return DbContext.GetPdfQuoteReport(quoteId);
        //}

        public static byte[] GetPdfQuoteReport(Guid quoteId)
        {
            var quote = DbContext.GetQuoteHistory().First(x => x.QuoteId.Equals(quoteId));
            var items = DbContext.GetItemsByQuote(quoteId).Where(x => x.QuoteId.Equals(quoteId)).OrderBy(x => x.SectionDisplay).ToList();
            var fees = DbContext.GetAllFees();

            using (MemoryStream ms = new MemoryStream())
            { 
                Document doc = new Document(PageSize.A4, 0, 0, 0, 0);

                PdfWriter.GetInstance(doc, new FileStream(AppDomain.CurrentDomain.BaseDirectory + quote.ClientName + ".pdf", FileMode.Create));
                PdfWriter writer = PdfWriter.GetInstance(doc, ms);

                PdfAction action = new PdfAction(PdfAction.PRINTDIALOG);
                writer.SetOpenAction(action);
                 
                doc.Open();

                #region Logos/ Heading

                const string hollardImagePath = "https://quotes.nfbst.co.za/images/Hollard.png";
                const string nfbImagepath = "https://quotes.nfbst.co.za/images/NFB_300_147_90.jpg";
                const string fiaImagepath = "https://quotes.nfbst.co.za/images/Fia.png";
                const string labelImagepath = "https://quotes.nfbst.co.za/images/quote.png";

                Image gif1 = Image.GetInstance(hollardImagePath);
                gif1.ScaleToFit(40f, 40f);
                Image gif2 = Image.GetInstance(nfbImagepath);
                gif2.ScaleToFit(80f, 80f);
                Image gif3 = Image.GetInstance(fiaImagepath);
                gif3.ScaleToFit(40f, 40f);
                Image gif4 = Image.GetInstance(labelImagepath);
                gif3.ScaleToFit(40f, 40f);

                PdfPTable logosTable = new PdfPTable(3);
                logosTable.DefaultCell.Border = Rectangle.NO_BORDER;

                PdfPCell logoscell = new PdfPCell(new Phrase());

                logoscell.Border = 0;
                logoscell.Colspan = 3;
                logoscell.HorizontalAlignment = 1; //0=Left, 1=Centre, 2=Right

                logosTable.AddCell(gif1);
                logosTable.AddCell(gif2);
                logosTable.AddCell(gif3);
                logosTable.AddCell("");
                logosTable.AddCell(gif4);
                logosTable.AddCell("");

                doc.Add(Chunk.NEWLINE);



                doc.Add(logosTable);

                #endregion
            }


            return DbContext.GetPdfQuoteReport(quoteId);
        }


        public static bool CreateReportt(string dom)
        {
            try
            {
                Document document = new Document(PageSize.A4, 80, 50, 30, 65);
                PdfWriter.GetInstance(document, new FileStream(AppDomain.CurrentDomain.BaseDirectory + Guid.NewGuid() + ".pdf", FileMode.Create));
                document.Open();
                HTMLWorker hw =
                             new HTMLWorker(document);
                hw.Parse(new StringReader(dom));
                document.Close();
                return true;
            }
            catch (Exception exc)
            {
                Console.Error.WriteLine(exc.Message);
                return false;
            }
        }

        public static bool EmailReportQuote(Guid quoteId)
        {
            var quote = DbContext.GetQuoteHistory().First(x => x.QuoteId.Equals(quoteId));//Toget the email address to send to
            byte[] quotePdfByteArray = DbContext.GetPdfQuoteReport(quoteId);
            Stream quotePdfStream = new MemoryStream(quotePdfByteArray);
            try
            {
                var smtp = new SmtpClient();
                var mailMessage = new MailMessage();
                mailMessage.To.Add(new MailAddress("mtshona@nvestholdings.co.za"/*quote.Email*/));
                mailMessage.Subject = "Quote From NFB Insurance Brokers";
                mailMessage.Body = "Hi, See Attached your quote";
                Attachment attachment = new Attachment(quotePdfStream, MediaTypeNames.Application.Pdf);

                ContentDisposition disposition = attachment.ContentDisposition;

                disposition.DispositionType = DispositionTypeNames.Attachment;
                mailMessage.Attachments.Add(attachment);
                smtp.Send(mailMessage);
                return true;
            }
            catch (SmtpException e)
            {
                return false;
            }

        }

        public static bool Test(string id)
        {
            try
            {
                #region 

                //string dirpath = Directory.GetCurrentDirectory();

                //const string hollardImagePath =
                //        @"D:/Projects/NFB Short Term/NFBST Quote System/NFBSTQS-Internal/images/Hollard.png";
                //const string nfbImagepath =
                //    @"D:/Projects/NFB Short Term/NFBST Quote System/NFBSTQS-Internal/images/NFB_300_147_90.jpg";
                //const string fiaImagepath =
                //    @"D:/Projects/NFB Short Term/NFBST Quote System/NFBSTQS-Internal/images/fia.png";
                //const string labelImagepath =
                //    @"D:/Projects/NFB Short Term/NFBST Quote System/NFBSTQS-Internal/images/quote.png";
                //string oldString1 = "C:\\images\\Hollard.png";
                //string oldString2 = "C:\\images\\NFB_300_147_90.jpg";
                //string oldString3 = "C:\\images\\fia.png";
                //string oldString4 = "C:\\images\\fia.png";

                //string newString1 = hollardImagePath;
                //string newString2 = nfbImagepath;
                //string newString3 = fiaImagepath;
                //string newString4 = labelImagepath;

                //id = id.Replace(oldString1, newString1);
                //id = id.Replace(oldString2, newString3);
                //id = id.Replace(oldString3, newString3);
                //id = id.Replace(oldString3, newString4);

                #endregion

                #region 

                //string appRootDir = AppDomain.CurrentDomain.BaseDirectory;
                //Document document = new Document();
                //PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(appRootDir + "Nkabinde.pdf", FileMode.Create));
                //document.Open();

                //HTMLWorker hw = new  HTMLWorker(document);
                //hw.Parse(new StringReader(id));

            

                    //id = id.Replace("<meta charset=\"utf-8\">", "<meta charset=\"utf-8\"/>");
                    //id = id.Replace("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"                            , "");
                    //id = id.Replace(" <link href=\"/assets/css/font-awesome.css\" rel=\"stylesheet\">"                                      , "");
                    //id = id.Replace("<link href=\"http://fonts.googleapis.com/css?family=Open+Sans\" rel=\"stylesheet\" type=\"text/css\">" , "");
                    //id = id.Replace("<link href=\"content/durandal.css\" rel=\"stylesheet\">"                                               , "");
                    //id = id.Replace("<link href=\"content/css/styles.css\" rel=\"stylesheet\">"                                             , "");
                    //id = id.Replace("<link href=\"content/bootstrap.css\" rel=\"stylesheet\">"                                              , "");
                    //id = id.Replace("<link href=\"content/toastr.css\" rel=\"stylesheet\">"                                                 , "");
                    //id = id.Replace("<link href=\"css/style.css\" rel=\"stylesheet\">"                                                      , "");
                    //id = id.Replace("<link href=\"content/font-awesome.css\" rel=\"stylesheet\">"                                           , "");
                    //id = id.Replace("<link href=\"css/style.css\" rel=\"stylesheet\">"                                                      , "");
                    //id = id.Replace("<link href=\"content/css/jquery.dataTables.css\" rel=\"stylesheet\">"                                  , "");
                    //id = id.Replace("<link href=\"content/KoGrid.css\" rel=\"stylesheet\">"                                                 , "");
                    //id = id.Replace("<link href=\"content/style.css\" rel=\"stylesheet\">"                                                  , "");
                    //id = id.Replace("<link href=\"css/print.css\" rel=\"stylesheet\">"                                                      , "");
                    //id = id.Replace("<link href=\"css/printingMt.css\" rel=\"stylesheet\">"                                                 , "");


                    //id = id.Replace("<input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"username\" data-bind=\"value: username\">"                                           , "");
                    //id = id.Replace("<input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"password\" data-bind=\"value: password\">"                                       , "");
                    //id = id.Replace("<input id=\"txtSearch\" class=\"form-control\" placeholder=\"Search…\" type=\"search\" name=\"q\" data-bind=\"value: query, valueUpdate: 'keyup'\">"           , "");


                    //id = id.Replace("<img class=\"center-block\" src=\"../../images/NFB_300_147_90.jpg\">"                                                                                          , "");
                    //id = id.Replace("<img src=\"https://quotes.nfbst.co.za/images/Fia.png\" style=\"padding-top: 3%; padding-left: 72%; padding-top: 18%;\">"                                       , "");
                    //id = id.Replace("<img src=\"https://quotes.nfbst.co.za/images/NFB_300_147_90.jpg\">"                                                                                            , "");
                    //id = id.Replace("<img src=\"https://quotes.nfbst.co.za/images/Hollard.png\" style=\"padding-left: 0%; padding-top: 8%;\">"                                                      , "");

                    //id = id.Replace("<br>" , "");     
                 
             
   #endregion
                string appRootDir = AppDomain.CurrentDomain.BaseDirectory;
                

                Document document = new Document();
                StringReader sr = new StringReader(id);

                
                Font x = FontFactory.GetFont("nina fett");
                x.Size = 3;
                x.SetStyle("Italic");
                x.SetColor(100, 50, 200);
                PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(appRootDir + "Nkabinde3.pdf", FileMode.Create));
                document.Open();

                #region Logos/ Heading

                const string hollardImagePath = "https://quotes.nfbst.co.za/images/Hollard.png";
                const string nfbImagepath = "https://quotes.nfbst.co.za/images/NFB_300_147_90.jpg";
                const string fiaImagepath = "https://quotes.nfbst.co.za/images/Fia.png";
                const string labelImagepath = "https://quotes.nfbst.co.za/images/quote.png";

                Image gif1 = Image.GetInstance(hollardImagePath);
                gif1.ScaleToFit(40f, 40f);
                Image gif2 = Image.GetInstance(nfbImagepath);
                gif2.ScaleToFit(80f, 80f);
                Image gif3 = Image.GetInstance(fiaImagepath);
                gif3.ScaleToFit(40f, 40f);
                Image gif4 = Image.GetInstance(labelImagepath);
                gif3.ScaleToFit(40f, 40f);

                PdfPTable logosTable = new PdfPTable(3);
                logosTable.DefaultCell.Border = Rectangle.NO_BORDER;

                PdfPCell logoscell = new PdfPCell(new Phrase());

                logoscell.Border = 0;
                logoscell.Colspan = 3;
                logoscell.HorizontalAlignment = 1; //0=Left, 1=Centre, 2=Right

                logosTable.AddCell(gif1);
                logosTable.AddCell(gif2);
                logosTable.AddCell(gif3);
                logosTable.AddCell("");
                logosTable.AddCell(gif4);
                logosTable.AddCell("");

                document.Add(Chunk.NEWLINE);



                document.Add(logosTable);

                #endregion
                XMLWorkerHelper.GetInstance().ParseXHtml(
                  writer, document, sr
                );
                document.Close();

               
                return true;

            }
            catch (Exception)
            {
                return false;

            }
        }







        public static bool SaveExcess(Excess excess)
        {
            if (excess.ExcessId == Guid.Empty)
            {
                excess.ExcessId = Guid.NewGuid();
            }
            return DbContext.SaveExcess(excess);
        }
        public static bool DeleteExcess(Guid id)
        {
            return DbContext.DeleteExcess(id);
        }
        public static IList<Excess> GetAllExcesses()
        {
            return DbContext.GetAllExcesses();
        }

        public static bool SaveCommision(Commision com)
        {
            if (com.CommisionId == Guid.Empty)
            {
                com.CommisionId = Guid.NewGuid();
            }
            return DbContext.SaveCommision(com);
        }
        public static bool DeleteCommision(Guid id)
        {
            return DbContext.DeleteCommision(id);
        }
        public static IList<Commision> GetAllCommsions()
        {
            return DbContext.GetAllCommsions();
        }
        
    }
}
