using System;
using System.Collections.Generic;
 

namespace QsClasses
{
    public class Rating
    {
        public Guid    RecId                    { get; set; }
        public Guid    RatingId                 { get; set; }
        public String  RatingDescription               { get; set; }
        public Decimal Threshold                { get; set; }
        public Decimal RatingPercentageValue    { get; set; }
        public Decimal RatingInRands            { get; set; }
        public Guid    SectionId                { get; set; }
    }
}
