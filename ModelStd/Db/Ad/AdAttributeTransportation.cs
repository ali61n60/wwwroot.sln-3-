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

        [Column("fuelType")]
        [MaxLength(50)]
        public FuelType FuelType { get; set; }

        [Column("mileage")]
        public int? Mileage { get; set; }

        [Column("gearboxType")]
        [MaxLength(50)]
        public GearboxType GearboxType { get; set; }

        [Column("bodyColor")]
        [MaxLength(50)]
        public string BodyColor { get; set; }

        [Column("internalColor")]
        [MaxLength(50)]
        public string InternalColor { get; set; }

        [Column("bodyStatus")]
        [MaxLength(50)]
        public BodyStatus BodyStatus { get; set; }

        [Column("carStatus")]
        [MaxLength(50)]
        public CarStatus CarStatus { get; set; }

        [Column("plateType")]
        [MaxLength(50)]
        public PlateType PlateType { get; set; }

        public virtual Advertisement Ad { get; set; }
        public virtual CarModel CarModel { get; set; }
        
    }

    public enum FuelType
    {
        Petrol=1,
        Disel=2,
        Gas=3,
        Electric=4,
        GasPetrol=5,
        Hybrid=6,
        UnSpecified=7
    }

    public enum GearboxType
    {
        Manual=1,
        Automatic=2,
        UnSpecified=3
    }



    public enum BodyStatus
    {
        NoColor=1,
        OnePieceColored=2,
        TwoPiecesColored=3,
        MultiPieceColored=4,
        BumperColored=5,
        BumperChanged=6,
        HoodColored=7,
        RoundColored=8,
        FullyColored=9,
        Accident=10,
        Scrap=11,
        BodyChanged=12,
        UnSpecified=13
    }

    public enum CarStatus
    {
        New=1,
        Used=2,
        Draft=3,
        UnSpecified=4
    }

    public enum PlateType
    {
        National=1,
        FreeRegion=2,
        Temporary=3,
        UnSpecified=4
    }
}
