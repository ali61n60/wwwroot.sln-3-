using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace WcfService.Messages
{
    [DataContract]
    public enum ImageType
    {
        [EnumMember] NoImage,
        [EnumMember] FirstImage,
        [EnumMember] AllImages
    }
}