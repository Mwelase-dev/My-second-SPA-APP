using System;
 
namespace QsClasses
{
    public class CompulsoryFee
    {
        public Guid     FeeId           { get; set; }
        public String   FeeDescription  { get; set; }
        public Decimal  FeeValue        { get; set; }
        public Decimal  FeePercantage   { get; set; }

    }
}
