using System;
using System.Xml.Serialization;
using Newtonsoft.Json;


namespace QsClasses
{

    public class UserBase
    {
        public String UserName { get; set; }
        public String Password { get; set; }
    }

    public class UserAuth : UserBase
    {
        [JsonIgnore, XmlIgnore]
        public byte[] UserSalt { get; set; }
    }
    public class User : UserBase
    {
        public Guid     RecId       { get; set; }
        public Guid     UserId      { get; set; }
        public String   FirstName   { get; set; }
        public String   LastName    { get; set; }
        //public String   UserName    { get; set; }
        //public String   Password    { get; set; }
        public Guid     RoleId      { get; set; }
        public String   RoleName    { get; set; }
    }

    public class Role
    {
        public Guid     RecId       { get; set; }
        public Guid     RoleId      { get; set; }
        public String   RoleName  { get; set; }
    }

    public class UserRole
    {
        public Guid RecId   { get; set; }
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
    }
}
