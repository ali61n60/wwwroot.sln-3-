using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Model.ServiceLibrary
{
    [DataContract]
    public class SmsMessage
    {
        [DataMember]
        public string PhoneNumber;

        [DataMember]
        public string Message;

        [DataMember]
        public Guid MessageGuid;

        [DataMember]
        public DateTime MessageDate;

        [DataMember]
        public bool Sent;
    }
}
