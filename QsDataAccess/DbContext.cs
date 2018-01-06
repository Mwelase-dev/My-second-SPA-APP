using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using QsClasses;

namespace QsDataAccess
{
    public class DbContext
    {
        private static int _retry;
        private static bool _connected;

        public static List<Quote> GetQuoteHistory()
        {
            var quotes = new List<Quote>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetQuotes", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    quotes.Add(new Quote()
                    {
                        QuoteId = Guid.Parse(dr[1].ToString()),
                        ClientId = Guid.Parse(dr[2].ToString()),
                        ClientName = dr[3].ToString(),
                        QuoteDate = Convert.ToDateTime(dr[4].ToString()),
                        UnderWriter = dr[5].ToString(),
                        QuoteStatus = (dr[6].ToString()),
                        ContactNumber = GetClientContactNumber(Guid.Parse(dr[2].ToString())),
                        TotalAnnualPremium = Decimal.Parse(dr[8].ToString()),
                        TotalMonthlyPremium = Decimal.Parse(dr[9].ToString())

                    });

                }
                if (!quotes.Any())
                {
                    quotes.Add(new Quote()
                    {
                        QuoteId = Guid.NewGuid(),
                        ClientId = Guid.NewGuid(),
                        ClientName = "No Quotes were found",
                        QuoteDate = DateTime.Parse(DateTime.Now.ToString("f")),
                        UnderWriter = "",
                        QuoteStatus = "",
                        ContactNumber = "No contact info",
                        TotalAnnualPremium = Decimal.Parse("0,0"),
                        TotalMonthlyPremium = Decimal.Parse("0,0")
                    });
                }

                return quotes;
            }
        }

        private static string GetClientContactNumber(Guid clientId)
        {
            var contactNumber = "";
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetClientContactNumber", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@ClientId", clientId);
                da.Fill(ds);
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    contactNumber = dr[0].ToString();
                }

                return contactNumber;
            }
        }

        public static Quote GetQuoteById(Guid quoteId)
        {
            var quote = new Quote();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetQuotes", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.SelectCommand.Parameters.AddWithValue("@QuoteId", quoteId);

                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    quote = new Quote()
                    {
                        ClientName = dr[0].ToString(),
                        QuoteDate = Convert.ToDateTime(dr[1].ToString()),
                        UnderWriter = dr[2].ToString()
                    };

                }
                return quote;
            }
        }

        public static List<Rating> GetRatings(Guid sectionId)
        {
            var ratings = new List<Rating>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetRatings", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@SectionId", sectionId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ratings.Add(new Rating()
                    {
                        RatingId = Guid.Parse(dr[1].ToString()),
                        SectionId = Guid.Parse(dr[2].ToString()),
                        RatingDescription = (dr[3].ToString()),
                        RatingPercentageValue = Decimal.Parse(dr[4].ToString()),
                        Threshold = Decimal.Parse(dr[5].ToString()),
                        RatingInRands = Decimal.Parse(dr[6].ToString()),
                    });

                }

                //if (!ratings.Any())
                //{
                //    ratings.Add(new Rating()
                //    {
                //        RatingId = Guid.Empty,
                //        SectionId = Guid.Empty,
                //        RatingDescription = "No Ratings were found",
                //        RatingPercentageValue = 0,
                //        Threshold = 0
                //    });
                //}
                return ratings;
            }
        }

        public static bool SaveRating(Rating rating)
        {
            throw new NotImplementedException();
        }

        public static bool UpdateRating(Rating rating)
        {
            using (
               var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
               )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateRating", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@SectionId", rating.SectionId);
                cmd.Parameters.AddWithValue("@RatingId", rating.RatingId);
                cmd.Parameters.AddWithValue("@RatingName", rating.RatingDescription);
                cmd.Parameters.AddWithValue("@Threshold", rating.Threshold);
                cmd.Parameters.AddWithValue("@RatingPercentageValue", rating.RatingPercentageValue);
                cmd.Parameters.AddWithValue("@RatingInRands", rating.RatingInRands == 0 ? 0 : rating.RatingInRands);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool SaveDiscounts(Discount discount)
        {
            throw new NotImplementedException();
        }

        public static List<Loading> GetLoadings(Guid sectionId)
        {
            var loadings = new List<Loading>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetLoadings", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@SectionID", sectionId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    loadings.Add(new Loading()
                    {
                        LoadingId = Guid.Parse(dr[1].ToString()),
                        SectionId = Guid.Parse(dr[2].ToString()),
                        LoadingDescription = (dr[3].ToString()),
                        LoadingRate = Decimal.Parse(dr[4].ToString())
                    });

                }
                //if (!loadings.Any())
                //{
                //    loadings.Add(new Loading()
                //    {
                //        LoadingId = Guid.NewGuid(),
                //        SectionId = sectionId,
                //        LoadingDescription = "No Loading",
                //        LoadingRate = Decimal.Parse("0,0")
                //    });
                //}
                return loadings;
            }
        }

        public static List<Discount> GetDiscounts(Guid sectionId)
        {
            var discounts = new List<Discount>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetDiscounts", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.SelectCommand.Parameters.AddWithValue("@SectionID", sectionId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    discounts.Add(new Discount()
                    {
                        DiscountId = Guid.Parse(dr[1].ToString()),
                        SectionId = Guid.Parse(dr[2].ToString()),
                        DiscountDescription = (dr[3].ToString()),
                        DiscountRate = Decimal.Parse(dr[4].ToString())
                    });

                }
                //if (!discounts.Any())
                //{
                //    discounts.Add(new Discount()
                //    {
                //        DiscountId = Guid.NewGuid(),
                //        SectionId = sectionId,
                //        DiscountDescription = "NoDiscount",
                //        DiscountRate = Decimal.Parse("0,0")
                //    });
                //}
                //else
                //{
                //    return discounts;
                //}
                return discounts;
            }
        }

        public static List<Section> GetSections()
        {
            var sections = new List<Section>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetSections", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    sections.Add(new Section()
                    {
                        SectionId = Guid.Parse(dr[1].ToString()),
                        SectionName = (dr[2].ToString())
                    });

                }
                if (!sections.Any())
                {
                    sections.Add(new Section()
                    {
                        SectionId = Guid.Empty,
                        SectionName = "No Sections found"
                    });

                }
                return sections;
            }
        }

        public static List<Rating> GetAllRatings()
        {

            var ratings = new List<Rating>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllRatings", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ratings.Add(new Rating()
                    {
                        RatingId = Guid.Parse(dr[1].ToString()),
                        SectionId = Guid.Parse(dr[2].ToString()),
                        RatingDescription = (dr[3].ToString()),
                        RatingPercentageValue = Decimal.Parse(dr[4].ToString()),
                        Threshold = Decimal.Parse(dr[5].ToString()),
                        RatingInRands = Decimal.Parse(dr[6].ToString())
                    });

                }
                if (!ratings.Any())
                {
                    ratings.Add(new Rating()
                    {
                        RatingId = Guid.Empty,
                        SectionId = Guid.Empty,
                        RatingDescription = "No Ratings found",

                    });
                }
                return ratings;
            }
        }

        public static bool CreateNewRating(Rating rating)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveRating", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RatingId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@RatingDescription", rating.RatingDescription);
                cmd.Parameters.AddWithValue("@Threshold", rating.Threshold);
                cmd.Parameters.AddWithValue("@RatingPercentageValue", rating.RatingPercentageValue);
                cmd.Parameters.AddWithValue("@SectionId", rating.SectionId);
                cmd.Parameters.AddWithValue("@RatingInRands", rating.RatingInRands);
                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }
                return true;

            }
        }

        private static bool TryToReconect(SqlConnection myConnection, SqlCommand cmd)
        {
            try
            {
                myConnection.Open();
                cmd.ExecuteNonQuery();
                myConnection.Close();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static bool CreateNewQuote(Quote quote)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                //DateTime date = new DateTime(int.Parse(DateTime.Now.Year.ToString()), int.Parse(DateTime.Now.Month.ToString()), int.Parse(DateTime.Now.Date.ToString()), int.Parse(DateTime.Now.Hour.ToString()), int.Parse(DateTime.Now.Minute.ToString()), int.Parse(DateTime.Now.Millisecond.ToString()));
                myConnection.Open();
                var cmd = new SqlCommand("procSaveQuote", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@QuoteId", quote.QuoteId);
                cmd.Parameters.AddWithValue("@ClientId", quote.ClientId);
                cmd.Parameters.AddWithValue("@QuoteDate", DateTime.Parse(DateTime.Now.ToString("f")));
                cmd.Parameters.AddWithValue("@UnderWriter", quote.UnderWriter);//quote.UnderWriter != "" ? "System" : quote.UnderWriter); //quote.UnderWriter
                cmd.Parameters.AddWithValue("@QuoteStatus", "Pending"); //quote.QuoteStatus
                cmd.Parameters.AddWithValue("@ClientName", quote.ClientName);
                //cmd.Parameters.AddWithValue("@Email", quote.Email);
                cmd.Parameters.AddWithValue("@TotalMonthlyPremium", quote.TotalMonthlyPremium);
                cmd.Parameters.AddWithValue("@TotalAnnualPremium ", quote.TotalAnnualPremium);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }
                return true;
            }
        }

        public static void SaveInsuredItem(InsuredItem insuredItem, Guid quoteId, Guid clientId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveInsuredItem", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@ItemId", insuredItem.ItemId);
                cmd.Parameters.AddWithValue("@ClientId", clientId);
                cmd.Parameters.AddWithValue("@QuoteId", quoteId);
                cmd.Parameters.AddWithValue("@SectionId", insuredItem.SectionId);
                cmd.Parameters.AddWithValue("@ItemDescription", insuredItem.ItemDescription);
                cmd.Parameters.AddWithValue("@ItemValue", insuredItem.ItemValue);
                cmd.Parameters.AddWithValue("@MonthlyPremium ", insuredItem.MonthlyPremium);
                cmd.Parameters.AddWithValue("@AnnualPremium", insuredItem.AnnualPremium);
                cmd.Parameters.AddWithValue("@Comments", insuredItem.Comments != null ? insuredItem.Comments : "N/A");

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }
            }
        }

        public static void SaveClient(Client client)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveClient", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@ClientId", client.ClientId);
                cmd.Parameters.AddWithValue("@ClientFirstName", client.ClientFirstName);
                cmd.Parameters.AddWithValue("@ClientLastName", client.ClientLastName);
                cmd.Parameters.AddWithValue("@ContactNumber", client.ContactNumer);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }

        }

        public static bool AddSection(Section section)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveSection", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@SectionId", section.SectionId);
                cmd.Parameters.AddWithValue("@SectionName", section.SectionName);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }
                return true;
            }
        }

        public static void AddRatings(Rating rating, Guid sectionId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveRating", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RatingId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@RatingDescription", rating.RatingDescription);
                cmd.Parameters.AddWithValue("@Threshold", rating.Threshold == 0 ? 0 : rating.Threshold);
                cmd.Parameters.AddWithValue("@RatingPercentageValue", rating.RatingPercentageValue);
                cmd.Parameters.AddWithValue("@RatingInRands", rating.RatingInRands == 0 ? 0 : rating.RatingInRands);
                cmd.Parameters.AddWithValue("@SectionId", sectionId);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static void AddDiscounts(Discount discount, Guid sectionId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveDiscount", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@DiscountId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@SectionId", sectionId);
                cmd.Parameters.AddWithValue("@DiscountDescription", discount.DiscountDescription);
                cmd.Parameters.AddWithValue("@DiscountRate", discount.DiscountRate);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static void AddLoadings(Loading loading, Guid sectionId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveLoadings", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@LoadingId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@SectionId", sectionId);
                cmd.Parameters.AddWithValue("@LoadingDescription", loading.LoadingDescription);
                cmd.Parameters.AddWithValue("@LoadingRate", loading.LoadingRate);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static bool CreateNewRole(Role role)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procCreateRole", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@RoleId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@RoleName", role.RoleName);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool AssignRoleToUser(UserRole userRole)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procAssignRoleToUser", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@UserId", userRole.UserId);
                cmd.Parameters.AddWithValue("@RoleId", userRole.RoleId);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static IList<User> GetAllUsers()
        {
            var users = new List<User>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllUsers", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    users.Add(new User()
                    {
                        UserId = Guid.Parse(dr[1].ToString()),
                        FirstName = (dr[2].ToString()),
                        LastName = dr[3].ToString(),
                        UserName = (dr[4].ToString()),
                        Password = dr[5].ToString(),
                        RoleId = Guid.Parse(dr[6].ToString()),
                        RoleName = GetRoleNameByRoleId(Guid.Parse(dr[6].ToString()))

                    });

                }
                return users;
            }
        }

        public static IList<User> GetAllUsersForFrontEnd()
        {
            var users = new List<User>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllUsers", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    users.Add(new User()
                    {
                        UserId = Guid.Parse(dr[1].ToString()),
                        FirstName = (dr[2].ToString()),
                        LastName = dr[3].ToString(),
                        UserName = (dr[4].ToString()),
                        // Password = dr[5].ToString(),
                        RoleId = Guid.Parse(dr[6].ToString()),
                        RoleName = GetRoleNameByRoleId(Guid.Parse(dr[6].ToString()))

                    });

                }
                return users;
            }
        }

        private static string GetRoleNameByRoleId(Guid roleId)
        {
            var roleName = "";

            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetRoleName", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.SelectCommand.Parameters.AddWithValue("@RoleId", roleId);

                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    roleName = dr[0].ToString();
                }
            }
            return roleName;
        }

        public static bool DeleteUser(Guid userId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteUser", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserId", userId);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool DeleteQuote(Guid quoteId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteQuotes", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@QuoteId", quoteId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool DeleteInsuredItemFromSavedQuote(Guid itemId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteInsuredItem", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ItemId", itemId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static IList<Role> GetAllRoles()
        {
            var roles = new List<Role>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllRoles", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    roles.Add(new Role()
                    {
                        RoleId = Guid.Parse(dr[1].ToString()),
                        RoleName = (dr[2].ToString()),
                    });

                }
                return roles;
            }
        }

        public static IList<InsuredItem> GetItemsByQuote(Guid quoteId)
        {
            var items = new List<InsuredItem>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetItemsByQuoteId", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@QuoteId", quoteId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    items.Add(new InsuredItem()
                    {
                        ItemId = Guid.Parse(dr[1].ToString()),
                        ClientId = Guid.Parse(dr[2].ToString()),
                        QuoteId = Guid.Parse(dr[3].ToString()),
                        ItemDescription = (dr[4].ToString()),
                        ItemValue = Decimal.Parse(dr[5].ToString()),
                        MonthlyPremium = Decimal.Parse(dr[6].ToString()),
                        AnnualPremium = Decimal.Parse(dr[7].ToString()),
                        SectionId = Guid.Parse(dr[8].ToString()),
                        InsuredItemDiscounts = GetItemDiscounts(Guid.Parse(dr[1].ToString())),
                        InsuredItemLoadings = GetItemLoadings(Guid.Parse(dr[1].ToString())),
                        QuoteWarranties = GetItemWarrantiess(Guid.Parse(dr[1].ToString())),
                        InsuredItemDiscountsDisplay = GetItemDiscountsDisplay(GetItemDiscounts(Guid.Parse(dr[1].ToString()))),
                        InsuredItemLoadingsDisplay = GetItemLoadingsDisplay(GetItemLoadings(Guid.Parse(dr[1].ToString()))),
                        QuoteWarrantiesDisplay = GetItemWarrantiesDisplay(GetItemWarrantiess(Guid.Parse(dr[1].ToString()))),
                        Comments = dr[9].ToString(),
                        SectionDisplay = GetItemSectionDisplay(Guid.Parse(dr[8].ToString())),
                        InsuredItemDiscountsModels = GetItemDiscountsModels(GetItemDiscounts(Guid.Parse(dr[1].ToString()))),
                        InsuredItemLoadingsModels = GetItemLoadingsModels(GetItemLoadings(Guid.Parse(dr[1].ToString()))),
                    });
                }
                //if (!items.Any())
                //{
                //    items.Add(new InsuredItem()
                //    {
                //        Comments = "No Items found"
                //    });



                //}

                return items;
            }
        }

        private static List<Loading> GetItemLoadingsModels(List<Guid> getItemLoadings)
        {
            var loadings = new List<Loading>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetLoadingModel", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                foreach (Guid itemLoading in getItemLoadings)
                {
                    cmd.Parameters.Clear();
                    da.SelectCommand.Parameters.AddWithValue("@LoadingId", itemLoading);
                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        loadings.Add(new Loading()
                        {
                            LoadingId = Guid.Parse(dr[1].ToString()),
                            SectionId = Guid.Parse(dr[2].ToString()),
                            LoadingDescription = (dr[3].ToString()),
                            LoadingRate = Decimal.Parse(dr[4].ToString())
                        });
                    }
                }
                return loadings;
            }
        }

        private static List<Discount> GetItemDiscountsModels(List<Guid> getItemDiscounts)
        {
            var discounts = new List<Discount>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetDiscountModel", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                foreach (Guid itemDiscount in getItemDiscounts)
                {
                    cmd.Parameters.Clear();
                    da.SelectCommand.Parameters.AddWithValue("@DiscountId", itemDiscount);
                    da.Fill(ds);
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        discounts.Add(new Discount()
                        {
                            DiscountId = Guid.Parse(dr[1].ToString()),
                            SectionId = Guid.Parse(dr[2].ToString()),
                            DiscountDescription = (dr[3].ToString()),
                            DiscountRate = Decimal.Parse(dr[4].ToString())
                        });

                    }
                }
                return discounts;
            }
        }

        private static string GetItemSectionDisplay(Guid sectionId)
        {
            var sectionName = "";
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetSectionName", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@SectionId", sectionId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    sectionName = dr[0].ToString();

                }
                return sectionName;
            }
        }

        private static List<String> GetItemDiscountsDisplay(List<Guid> itemId)
        {
            var insuredItemDiscounts = new List<String>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetDiscountDescription", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                foreach (Guid guid in itemId)
                {
                    cmd.Parameters.Clear();
                    da.SelectCommand.Parameters.AddWithValue("@DiscountId", guid);
                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        insuredItemDiscounts.Add((dr[0].ToString()));
                    }

                }

                return insuredItemDiscounts;
            }
        }

        private static List<String> GetItemLoadingsDisplay(List<Guid> itemId)
        {
            var insuredItemLoadings = new List<String>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetLoadingDescription", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                foreach (Guid guid in itemId)
                {
                    cmd.Parameters.Clear();
                    da.SelectCommand.Parameters.AddWithValue("@LoadingId", guid);

                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        insuredItemLoadings.Add((dr[0].ToString()));
                    }
                }

                return insuredItemLoadings;
            }
        }

        private static List<String> GetItemWarrantiesDisplay(List<Guid> itemId)
        {
            var itemWarrantiess = new List<String>();

            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetWarrantyDescription", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;


                foreach (Guid guid in itemId)
                {
                    SqlDataAdapter da;
                    da = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();

                    cmd.Parameters.Clear();
                    da.SelectCommand.Parameters.AddWithValue("@WarrantyId", guid);
                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        itemWarrantiess.Add((dr[0].ToString()));
                    }
                }

                return itemWarrantiess;
            }
        }

        private static List<Guid> GetItemDiscounts(Guid itemId)
        {
            var insuredItemDiscounts = new List<Guid>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetInsuredItemDiscountsByItemId", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@ItemId", itemId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    insuredItemDiscounts.Add(Guid.Parse(dr[0].ToString()));
                }
                return insuredItemDiscounts;
            }
        }

        private static List<Guid> GetItemLoadings(Guid itemId)
        {
            var insuredItemLoadings = new List<Guid>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetInsuredItemLoadingsByItemId", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@ItemId", itemId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    insuredItemLoadings.Add(Guid.Parse(dr[0].ToString()));
                }
                return insuredItemLoadings;
            }
        }

        private static List<Guid> GetItemWarrantiess(Guid itemId)
        {
            var itemWarrantiess = new List<Guid>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetInsuredItemWarrantiessByItemId", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@ItemId", itemId);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    itemWarrantiess.Add(Guid.Parse(dr[0].ToString()));
                }
                return itemWarrantiess;
            }
        }

        public static bool DeleteRating(Guid ratingId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteRating", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RatingId", ratingId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool DeleteDiscount(Guid discountId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteDiscount", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@DiscountId", discountId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool DeleteLoading(Guid loadingId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteLoading", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@LoadingId", loadingId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }
         
        public static bool UpdateRatingById(Rating rating)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateRating", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RatingId", rating.RatingId);
                cmd.Parameters.AddWithValue("@RatingName", rating.RatingDescription);
                cmd.Parameters.AddWithValue("@Threshold", rating.Threshold);
                cmd.Parameters.AddWithValue("@RatingPercentageValue", rating.RatingPercentageValue);
                cmd.Parameters.AddWithValue("@RatingInRands", rating.RatingInRands);
                cmd.Parameters.AddWithValue("@SectionId", rating.SectionId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool AddItemToExistingQuote(InsuredItem item)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveInsuredItem", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@ItemId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@ClientId", item.ClientId);
                cmd.Parameters.AddWithValue("@QuoteId", item.QuoteId);
                cmd.Parameters.AddWithValue("@SectionId", item.SectionId);
                cmd.Parameters.AddWithValue("@ItemDescription", item.ItemDescription);
                cmd.Parameters.AddWithValue("@ItemValue", item.ItemValue);
                cmd.Parameters.AddWithValue("@MonthlyPremium ", item.MonthlyPremium);
                cmd.Parameters.AddWithValue("@AnnualPremium", item.AnnualPremium);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool UpdateInsuredItemById(InsuredItem item)
        {

            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateInsuredItem", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ItemId", item.ItemId);
                cmd.Parameters.AddWithValue("@ItemDescription", item.ItemDescription);
                cmd.Parameters.AddWithValue("@ItemValue", item.ItemValue);
                cmd.Parameters.AddWithValue("@MonthlyPremium ", item.MonthlyPremium);
                cmd.Parameters.AddWithValue("@AnnualPremium", item.AnnualPremium);
                cmd.Parameters.AddWithValue("@Comments", item.Comments);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool UpdateUserAccountByUserId(User user, byte[] salt)
        {

            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procupUpdateUser", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserId", user.UserId);
                cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                cmd.Parameters.AddWithValue("@LastName", user.LastName);
                cmd.Parameters.AddWithValue("@UserName", user.UserName);
                cmd.Parameters.AddWithValue("@Password", user.Password);
                cmd.Parameters.AddWithValue("@RoleId", user.RoleId);
                cmd.Parameters.AddWithValue("@Salt", salt);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool CreateNewUser(User user, byte[] salt)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procCreateUser", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@UserId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                cmd.Parameters.AddWithValue("@LastName", user.LastName);
                cmd.Parameters.AddWithValue("@UserName", user.UserName);
                cmd.Parameters.AddWithValue("@Password", user.Password);
                cmd.Parameters.AddWithValue("@RoleId", user.RoleId);
                cmd.Parameters.AddWithValue("@Salt", salt);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                    return true;
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                    return false;
                }
            }
        }

        public static bool UpdateUserRole(UserRole user)
        {

            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateUserRole", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserId", user.UserId);
                cmd.Parameters.AddWithValue("@RoleId", user.RoleId);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        //public static User VerifyLoginCredentials(string username, string password)
        //{
        //    var quote = new User();
        //    SqlDataAdapter da;
        //    DataSet ds = new DataSet();
        //    using (
        //        var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
        //        )
        //    {
        //        myConnection.Open();
        //        var cmd = new SqlCommand("procAuthenticate", myConnection);
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        da = new SqlDataAdapter(cmd);

        //        da.SelectCommand.Parameters.AddWithValue("@Username", username);
        //        da.SelectCommand.Parameters.AddWithValue("@Password", password);

        //        da.Fill(ds);

        //        foreach (DataRow dr in ds.Tables[0].Rows)
        //        {
        //            quote = new User()
        //            {
        //                UserId = Guid.Parse(dr[1].ToString()),
        //                FirstName = (dr[2].ToString()),
        //                LastName = dr[3].ToString(),
        //                RoleId = Guid.Parse(dr[6].ToString()),
        //                UserName = (dr[4].ToString())
        //            };

        //        }
        //        return quote;
        //    }
        //}

        public static User VerifyLoginCredentials(string username, string password)
        {
            var quote = new User();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procAuthenticate", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.SelectCommand.Parameters.AddWithValue("@Username", username);
                da.SelectCommand.Parameters.AddWithValue("@Password", password);

                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    quote = new User()
                    {
                        UserId = Guid.Parse(dr[1].ToString()),
                        FirstName = (dr[2].ToString()),
                        LastName = dr[3].ToString(),
                        RoleId = Guid.Parse(dr[6].ToString()),
                        UserName = (dr[4].ToString()),
                        RoleName = GetRoleNameByRoleId(Guid.Parse(dr[6].ToString()))
                    };

                }
                return quote;
            }
        }

        public static bool AddNewFee(CompulsoryFee fee)
        {

            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveFee", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@FeeId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@FeeDescription", fee.FeeDescription);
                cmd.Parameters.AddWithValue("@FeeValue", fee.FeeValue);
                cmd.Parameters.AddWithValue("@FeePercantage", fee.FeePercantage);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool UpdateFeeById(CompulsoryFee fee)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateFee", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FeeId", fee.FeeId);
                cmd.Parameters.AddWithValue("@FeeDescription", fee.FeeDescription);
                cmd.Parameters.AddWithValue("@FeeValue", fee.FeeValue);
                cmd.Parameters.AddWithValue("@FeePercantage", fee.FeePercantage);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool DeleteFeeById(Guid fee)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteFee", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FeeId", fee);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static IList<CompulsoryFee> GetAllFees()
        {

            var fees = new List<CompulsoryFee>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllFees", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    fees.Add(new CompulsoryFee()
                    {
                        FeeId = Guid.Parse(dr[1].ToString()),
                        FeeDescription = (dr[2].ToString()),
                        FeeValue = Decimal.Parse(dr[3].ToString()),
                        FeePercantage = Decimal.Parse(dr[4].ToString())
                    });

                }
                if (!fees.Any())
                {
                    fees.Add(new CompulsoryFee()
                    {
                        FeeId = Guid.NewGuid(),
                        FeeDescription = "No Fees found",
                        FeeValue = Decimal.Parse("0,0"),
                        FeePercantage = Decimal.Parse("0,0")
                    });
                }
                return fees;
            }
        }

        public static bool AddItemsToQuote(InsuredItem item, Guid quoteId, Guid clientId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procAddItemsToQuote", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ItemId", item.ItemId);
                cmd.Parameters.AddWithValue("@ItemDescription", item.ItemDescription);
                cmd.Parameters.AddWithValue("@ItemValue", item.ItemValue);
                cmd.Parameters.AddWithValue("@MonthlyPremium", item.MonthlyPremium);
                cmd.Parameters.AddWithValue("@AnnualPremium", item.AnnualPremium);
                cmd.Parameters.AddWithValue("@QuoteId", quoteId);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static void UpdateQuote(Quote quote)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateQuote", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@QuoteId", quote.QuoteId);
                cmd.Parameters.AddWithValue("@ClientId", quote.ClientId);
                cmd.Parameters.AddWithValue("@QuoteDate", DateTime.Now);
                cmd.Parameters.AddWithValue("@UnderWriter", quote.UnderWriter);
                cmd.Parameters.AddWithValue("@QuoteStatus", "Pending"); //quote.QuoteStatus
                cmd.Parameters.AddWithValue("@ClientName", quote.ClientName);
                cmd.Parameters.AddWithValue("@TotalMonthlyPremium", quote.TotalMonthlyPremium);
                cmd.Parameters.AddWithValue("@TotalAnnualPremium ", quote.TotalAnnualPremium);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static void SaveItemDiscounts(Guid discountId, Guid itemId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procAddItemsDiscount", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@DiscountId", discountId);
                cmd.Parameters.AddWithValue("@ItemId", itemId);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }

        }

        public static void SaveItemLoadings(Guid loadingId, Guid itemId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procAddItemsLoading", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@LoadingId", loadingId);
                cmd.Parameters.AddWithValue("@ItemId", itemId);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static void UpdateQuoteStatusToExpired(Quote quote)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateQuoteStatusToExpired", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@QuoteId", quote.QuoteId);
                cmd.Parameters.AddWithValue("@QuoteStatus", "Expired");

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static List<Role> GetAllUserRoles()
        {
            var roles = new List<Role>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllRoles", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    roles.Add(new Role()
                    {
                        RecId = Guid.Parse(dr[1].ToString()),
                        RoleId = Guid.Parse(dr[2].ToString()),
                        RoleName = (dr[3].ToString()),

                    });

                }
            }
            return roles;
        }

        internal static List<Role> GetCurrentUserRoles(Guid userRoleId)
        {
            var roles = new List<Role>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetCurrentUserRoles", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.SelectCommand.Parameters.AddWithValue("@UserRoleId", userRoleId);

                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    roles.Add(new Role()
                    {
                        RecId = Guid.Parse(dr[0].ToString()),
                        RoleId = Guid.Parse(dr[1].ToString()),
                        RoleName = (dr[2].ToString()),

                    });

                }
            }
            return roles;
        }

        public static bool AddWarranty(QuoteWarranties waranty)
        {

            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveWarranty", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@WarantyId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@SectionId", waranty.SectionId);
                cmd.Parameters.AddWithValue("@WarrantyDescrption", waranty.WarrantyDescription);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static List<QuoteWarranties> GetAllWarranties()
        {
            var warranties = new List<QuoteWarranties>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetWarranties", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    warranties.Add(new QuoteWarranties()
                    {
                        WarrantyId = Guid.Parse(dr[1].ToString()),
                        SectionId = Guid.Parse(dr[2].ToString()),
                        WarrantyDescription = dr[3].ToString(),

                    });

                }
                if (!warranties.Any())
                {
                    warranties.Add(new QuoteWarranties()
                    {
                        WarrantyId = Guid.Empty,
                        SectionId = Guid.Empty,
                        WarrantyDescription = "No Warranties were found",

                    });
                }

                return warranties;

            }
        }

        public static bool UpdateWarrantyById(QuoteWarranties warranty)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateWarranty", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@WarrantyId", warranty.WarrantyId);
                cmd.Parameters.AddWithValue("@WarrantyDescription", warranty.WarrantyDescription);


                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static List<QuoteWarranties> GetWarantiesBySectionId(Guid sectionId)
        {
            var warranties = new List<QuoteWarranties>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetWarantiesBySectionId", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.SelectCommand.Parameters.AddWithValue("@SectionID", sectionId);
                da = new SqlDataAdapter(cmd);

                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    warranties.Add(new QuoteWarranties()
                    {
                        WarrantyId = Guid.Parse(dr[1].ToString()),
                        SectionId = Guid.Parse(dr[2].ToString()),
                        WarrantyDescription = dr[3].ToString(),

                    });

                }
                 

                return warranties;

            }


        }

        public static bool ChangeQuoteStatus(Guid quoteId, string status)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateQuoteStatus", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@QuoteId", quoteId);
                cmd.Parameters.AddWithValue("@QuoteStatus", status); //quote.QuoteStatus

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static void SaveWarranties(Guid waranty, Guid quoteId)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveWarranty", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@WarantyId", waranty);
                cmd.Parameters.AddWithValue("@QuoteId", quoteId);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static void UpdateSection(Section section)
        {
            using (
               var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
               )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateSection", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@SectionId", section.SectionId);
                cmd.Parameters.AddWithValue("@SectionName", section.SectionName);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static bool UpdateDiscounts(Discount discount)
        {
            using (
          var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
          )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateDiscount", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@DiscountId", discount.DiscountId);
                cmd.Parameters.AddWithValue("@DiscountDescription", discount.DiscountDescription);
                cmd.Parameters.AddWithValue("@DiscountRate", discount.DiscountRate);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static void UpdateLoading(Loading loading)
        {
            using (
                 var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                 )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procUpdateLoadings", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@LoadingId", loading.LoadingId);
                cmd.Parameters.AddWithValue("@LoadingDescription", loading.LoadingDescription);
                cmd.Parameters.AddWithValue("@LoadingRate", loading.LoadingRate);


                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static bool DeleteSection(Guid sectionId)
        {
            using (
               var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
               )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteSection", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@SectionId", sectionId);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static bool DeleteWarranty(Guid warrantyId)
        {
            using (
              var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
              )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteWarranty", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@WarrantyId", warrantyId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;
        }

        public static void SaveItemWarranties(Guid itemWarranty, Guid itemId)
        {
            using (
               var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
               )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveInsuredItemWarranty", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@RecId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@WarrantyId", itemWarranty);
                cmd.Parameters.AddWithValue("@ItemId", itemId);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static User GetUserModel(Guid userId)
        {
            var quote = new User();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();

                var cmd = new SqlCommand("procGetUserModel", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.SelectCommand.Parameters.AddWithValue("@UserId", userId);


                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    quote = new User()
                    {
                        UserId = Guid.Parse(dr[1].ToString()),
                        FirstName = (dr[2].ToString()),
                        LastName = dr[3].ToString(),
                        RoleId = Guid.Parse(dr[6].ToString()),
                        UserName = (dr[4].ToString()),
                        RoleName = GetRoleNameByRoleId(Guid.Parse(dr[6].ToString()))
                    };

                }
                return quote;
            }
        }

        public static void DeleteItemLoadings(Guid itemId)
        {
            using (
             var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
             )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteItemsLoading", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ItemId", itemId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static void DeleteItemDiscounts(Guid itemId)
        {
            using (
            var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
            )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteItemsDiscount", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@ItemId", itemId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }
            }
        }

        public static void DeleteItemWarranties(Guid itemId)
        {
            using (
            var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
            )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteInsuredItemWarranty", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ItemId", itemId);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
        }

        public static bool SavePdf(byte[] quoteReport, Guid quoteId)
        {
            using (
              var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
              )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveQuoteReportPDF", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ReportId", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@QuoteId", quoteId);
                cmd.Parameters.AddWithValue("@Report", quoteReport);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                    return true;
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                        
                    }
                    return false;
                }

            }
        }

        public static byte[] GetPdfQuoteReport(Guid quoteId)
        {
            byte[] quote = new byte[0x10000];
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();

                var cmd = new SqlCommand("procGetQuoteReport", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);

                da.SelectCommand.Parameters.AddWithValue("@QuoteId", quoteId);

                da.Fill(ds);
                //SqlDataReader reader = ds.ExecuteReader();
                //quote = reader.GetSqlBytes(index);
                //Response.BinaryWrite(bytes.Value);
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    quote = dr[0] as byte[];

                }
                return quote;
            }
        }
         
        public static bool SaveExcess(Excess exces)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveExcess", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ExcessId", exces.ExcessId);
                cmd.Parameters.AddWithValue("@ExcessDescription", exces.ExcessDescription);
                cmd.Parameters.AddWithValue("@ExcessDescriptionValue", exces.ExcessDescriptionValue);
                
                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }
                return true;

            }
        }
        public static bool DeleteExcess(Guid id)
        {
            using (
               var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
               )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteExcess", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ExcessId", id);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;

        }
        public static List<Excess> GetAllExcesses()
        {

            var excess = new List<Excess>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllExcesses", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    excess.Add(new Excess()
                    {
                        ExcessId = Guid.Parse(dr[0].ToString()),
                        ExcessDescription =  (dr[1].ToString()),
                        ExcessDescriptionValue = (dr[2].ToString()) 
                    });

                }
                if (!excess.Any())
                {
                    excess.Add(new Excess()
                    {
                        ExcessId = Guid.Empty,
                        ExcessDescription = "No Excess found",
                        ExcessDescriptionValue = ""

                    });
                }
                return excess;
            }
        }
 
        public static bool SaveCommision(Commision com)
        {
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procSaveCommision", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CommisionId", com.CommisionId);
                cmd.Parameters.AddWithValue("@CommisionDescription", com.CommisionDescription);
                cmd.Parameters.AddWithValue("@CommisionValue", com.CommisionValue);

                try
                {

                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                    return true;
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                    return false;
                }
               

            }
        }
        public static bool DeleteCommision(Guid id)
        {
            using (
               var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
               )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procDeleteCommision", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CommisionId", id);

                try
                {
                    cmd.ExecuteNonQuery();
                    myConnection.Close();
                }
                catch (SqlException ex)
                {
                    while (_retry < 5 && _connected == false)
                    {
                        _connected = TryToReconect(myConnection, cmd);
                        _retry++;

                        System.Threading.Thread.Sleep(10000); //600000 = 10 minutes
                    }
                    if (_retry > 5)
                    {
                        throw new Exception(String.Format("Error saving to ST Quote Database: {0}", ex.Message),
                            ex.InnerException);
                    }
                }

            }
            return true;

        }
        public static List<Commision> GetAllCommsions()
        {

            var commisions = new List<Commision>();
            SqlDataAdapter da;
            DataSet ds = new DataSet();
            using (
                var myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["NFBSTQS"].ConnectionString)
                )
            {
                myConnection.Open();
                var cmd = new SqlCommand("procGetAllCommisions", myConnection);
                cmd.CommandType = CommandType.StoredProcedure;
                da = new SqlDataAdapter(cmd);
                da.Fill(ds);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    commisions.Add(new Commision()
                    {
                        CommisionDescription = (dr[0].ToString()),
                        CommisionValue = Decimal.Parse(dr[1].ToString()),
                        CommisionId = Guid.Parse(dr[2].ToString())
                    });

                }
                if (!commisions.Any())
                {
                    commisions.Add(new Commision() 
                    {
                        CommisionId = Guid.Empty,
                        CommisionDescription = "No Commisions were found",
                        CommisionValue = 0

                    });
                }
                return commisions;
            }
        }
    }
}