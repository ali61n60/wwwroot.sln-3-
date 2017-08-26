using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class UsersExtraInfo
    {
        public Guid UserId { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public bool EmailAddressVerified { get; set; }
        public bool PhoneNumberVerified { get; set; }
        public string EmailAddressVerifyCode { get; set; }
        public string PhoneNumberVerifyCode { get; set; }
    }
}
