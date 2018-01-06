using System;
 

namespace QsClasses
{
    public class Discount
    {
        public Guid     RecId               { get; set; }
        public Guid     DiscountId          { get; set; }
        public Guid     SectionId           { get; set; }
        public String   DiscountDescription { get; set; }
        public Decimal  DiscountRate        { get; set; }
    }
}
