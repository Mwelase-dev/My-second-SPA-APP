using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QsClasses
{
    public class Commision
    {
        public Guid CommisionId { get; set; }
        public String CommisionDescription { get; set; }
        public Decimal CommisionValue { get; set; }
    }
}
