using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class Customer
    {
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public Guid CustomerGuid { get; set; }
        public bool VerifiedEmailAddress { get; set; }
        public bool VerifiedPhoneNumber { get; set; }
    }
}
