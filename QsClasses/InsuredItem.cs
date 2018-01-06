using System;
using System.Collections.Generic;
 
namespace QsClasses
{
    public class InsuredItem
    {
        public Guid                 RecId                          { get; set; }
        public Guid                 ItemId                      { get; set; }
        public Guid                 ClientId                    { get; set; }
        public Guid                 QuoteId                     { get; set; }
        public Guid                 SectionId                   { get; set; }
        public String               ItemDescription           { get; set; }
        public Decimal              ItemValue                { get; set; }
        public Decimal              MonthlyPremium           { get; set; }
        public Decimal              AnnualPremium            { get; set; }
        public String               Comments { get; set; }



        public List<Guid>           InsuredItemLoadings { get; set; }
        public List<Guid>           InsuredItemDiscounts { get; set; }
        public List<Guid>           QuoteWarranties { get; set; }

        public List<String>         InsuredItemLoadingsDisplay { get; set; }
        public List<String>         InsuredItemDiscountsDisplay { get; set; }
        public List<String>         QuoteWarrantiesDisplay { get; set; }



        public List<Loading>        InsuredItemLoadingsModels { get; set; }
        public List<Discount>       InsuredItemDiscountsModels { get; set; }

        public String SectionDisplay { get; set; }
    }
}
