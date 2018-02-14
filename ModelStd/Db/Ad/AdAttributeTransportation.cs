using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ModelStd.Db.Ad
{
    [Table("AdAttributeTransportations",Schema = "ad")]
    public class AdAttributeTransportation
    {
        [Column("adId")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid AdId { get; set; }

        [Column("modelId")]
        public int? ModelId { get; set; }

        [Column("makeYear")]
        public int? MakeYear { get; set; }

        [Column("fuel")]
        [MaxLength(50)]
        public string Fuel { get; set; }

        [Column("mileage")]
        public int? Mileage { get; set; }

        [Column("gearbox")]
        [MaxLength(50)]
        public string Gearbox { get; set; }

        [Column("bodyColor")]
        [MaxLength(50)]
        public string BodyColor { get; set; }

        [Column("internalColor")]
        [MaxLength(50)]
        public string InternalColor { get; set; }

        [Column("bodyStatus")]
        [MaxLength(50)]
        public string BodyStatus { get; set; }

        [Column("carStatus")]
        [MaxLength(50)]
        public string CarStatus { get; set; }

        [Column("plateType")]
        [MaxLength(50)]
        public string PlateType { get; set; }

        public virtual Advertisement Ad { get; set; }
        public virtual CarModel CarModel { get; set; }
        
    }

    public enum FuelType
    {
        Petrol,
        Disel,
        Gas,
        Electric,
        GasPetrol,
        Hybrid,
        UnSpecified
    }

    public enum GearboxType
    {
        Manual,
        Automatic,
        UnSpecified
    }



    public enum BodyStatus
    {
        NoColor,
        OnePieceColored,
        TwoPiecesColored,
        MultiPieceColored,
        BumperColored,
        BumperChanged,
        HoodColored,
        RoundColored,
        FullyColored,
        Accident,
        Scrap,
        BodyChanged,
        UnSpecified
    }

    public enum CarStatus
    {
        New,
        Used,
        Draft,
        UnSpecified
    }

    public enum PlateType
    {
        National,
        FreeRegion,
        Temporary,
        UnSpecified
    }
}
