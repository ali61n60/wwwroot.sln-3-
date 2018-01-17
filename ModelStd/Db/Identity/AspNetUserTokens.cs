using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Identity
{
    [Table("AspNetUserTokens", Schema = "identity")]
    public partial class AspNetUserTokens
    {
        public string UserId { get; set; }
        public string LoginProvider { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
