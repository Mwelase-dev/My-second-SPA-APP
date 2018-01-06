using System;
using System.Collections.Generic;
 

namespace QsClasses
{
   public class Section
    {
       public Guid   RecId                 { get; set; }
       public Guid              SectionId   { get; set; }
       public String            SectionName { get; set; }
       public List<Rating>      Ratings     { get; set; }
       public List<Discount>    Discounts   { get; set; }
       public List<Loading>     Loadings    { get; set; }

    }
}
