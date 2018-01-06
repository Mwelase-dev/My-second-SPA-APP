using System;
using System.Collections.Generic;

namespace QsClasses
{
    public class Quote
    {
        public Guid              RecId                 { get; set; }
        public String            ContactNumber  { get; set; }
        public String Email { get; set; }
        public Guid              QuoteId        { get; set; }
        public Guid              ClientId       { get; set; }
        public String            ClientName     { get; set; }
        public DateTime          QuoteDate      { get; set; }
        public String            UnderWriter    { get; set; }
        public String            QuoteStatus    { get; set; }
        public Decimal           TotalMonthlyPremium { get; set; }
        public Decimal           TotalAnnualPremium { get; set; }
        public string Markup { get; set; }


        public List<InsuredItem>    InsuredItems   { get; set; }
        public List<Guid>           QuoteWarranties { get; set; }
      
    }

    public class QuoteReportHtml
    {
        public string Markup { get; set; }
    }
}
