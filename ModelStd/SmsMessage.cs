﻿using System;
using System.Collections.Generic;
using System.Text;

namespace ModelStd
{
    public class SmsMessage
    {
        public string PhoneNumber { get; set; }
        public string TextMessage { get; set; }
        public int MessageId { get; set; }
    }
}
