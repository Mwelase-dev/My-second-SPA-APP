using System;
 

namespace QsClasses
{
    public class Client
    {
        public Guid     RecId           { get; set; }
        public Guid     ClientId        { get; set; }
        public String   ClientFirstName { get; set; }
        public String   ClientLastName  { get; set; }
        public String   ContactNumer    { get; set; }
    }
}
