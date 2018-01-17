using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Identity
{
    public partial class AspNetUserLogins
    {
        [Key]
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
        public string ProviderDisplayName { get; set; }
        public string UserId { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
