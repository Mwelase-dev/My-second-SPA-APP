using System;


namespace QsClasses
{
    public class Loading
    {
        public Guid     RecId                 { get; set; }
        public Guid     LoadingId           { get; set; }
        public Guid     SectionId           { get; set; }
        public String   LoadingDescription  { get; set; }
        public Decimal  LoadingRate         { get; set; }
    }
}
