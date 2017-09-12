﻿using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Sms
    {
        public Guid MessageId { get; set; }
        public string Message { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime MessageDate { get; set; }
        public bool Sent { get; set; }
    }
}