using System;
using System.Collections.Generic;

namespace RepositoryStd.DbModel
{
    public partial class Advertisements
    {
        public Advertisements()
        {
            AdAttributeTransportation = new HashSet<AdAttributeTransportation>();
            AdPrivilege = new HashSet<AdPrivilege>();
            SimilarAds = new HashSet<SimilarAds>();
        }

        public int WhatIsSheDoing { get; set; }
        public Guid AdId { get; set; }
        public Guid UserId { get; set; }
        public int CategoryId { get; set; }
        public int DistrictId { get; set; }
        public DateTime AdInsertDateTime { get; set; }
        public string AdLink { get; set; }
        public int AdStatusId { get; set; }
        public string AdTitle { get; set; }
        public string AdComments { get; set; }
        public int AdNumberOfVisited { get; set; }

        public virtual ICollection<AdAttributeTransportation> AdAttributeTransportation { get; set; }
        public virtual ICollection<AdPrivilege> AdPrivilege { get; set; }
        public virtual Price Price { get; set; }
        public virtual ICollection<SimilarAds> SimilarAds { get; set; }
        public virtual AdStatus AdStatus { get; set; }
        public virtual Categories Category { get; set; }
        public virtual Districts District { get; set; }
    }
}
