using System.Collections.Generic;

namespace ModelStd.Db.Ad
{
    public class AdStatus
    {
        public AdStatus()
        {
            Advertisements = new HashSet<Advertisement>();
        }

        public int AdStatusId { get; set; }
        public string AdStatus1 { get; set; }
        public string AdStatusEnglish { get; set; }

        public virtual ICollection<Advertisement> Advertisements { get; set; }
    }
}
