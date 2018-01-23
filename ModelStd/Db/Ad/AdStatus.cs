using System.Collections.Generic;

namespace ModelStd.Db.Ad
{
    public class AdStatus
    {
        public AdStatus()
        {
            Advertisements = new HashSet<Advertisements>();
        }

        public int AdStatusId { get; set; }
        public string AdStatus1 { get; set; }
        public string AdStatusEnglish { get; set; }

        public virtual ICollection<Advertisements> Advertisements { get; set; }
    }
}
