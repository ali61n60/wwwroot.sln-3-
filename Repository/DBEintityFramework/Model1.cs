namespace Repository.DBEintityFramework
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=Model11")
        {
        }

        public virtual DbSet<C__EFMigrationsHistory> C__EFMigrationsHistory { get; set; }
        public virtual DbSet<AdAttributeTransportation> AdAttributeTransportations { get; set; }
        public virtual DbSet<AdPrivilege> AdPrivileges { get; set; }
        public virtual DbSet<AdStatu> AdStatus { get; set; }
        public virtual DbSet<Advertisement> Advertisements { get; set; }
        public virtual DbSet<aspnet_Applications> aspnet_Applications { get; set; }
        public virtual DbSet<aspnet_Membership> aspnet_Membership { get; set; }
        public virtual DbSet<aspnet_Paths> aspnet_Paths { get; set; }
        public virtual DbSet<aspnet_PersonalizationAllUsers> aspnet_PersonalizationAllUsers { get; set; }
        public virtual DbSet<aspnet_PersonalizationPerUser> aspnet_PersonalizationPerUser { get; set; }
        public virtual DbSet<aspnet_Profile> aspnet_Profile { get; set; }
        public virtual DbSet<aspnet_Roles> aspnet_Roles { get; set; }
        public virtual DbSet<aspnet_SchemaVersions> aspnet_SchemaVersions { get; set; }
        public virtual DbSet<aspnet_Users> aspnet_Users { get; set; }
        public virtual DbSet<aspnet_WebEvent_Events> aspnet_WebEvent_Events { get; set; }
        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<CarModel> CarModels { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<District> Districts { get; set; }
        public virtual DbSet<MobileBrand> MobileBrands { get; set; }
        public virtual DbSet<Price> Prices { get; set; }
        public virtual DbSet<Privilege> Privileges { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        public virtual DbSet<SimilarAd> SimilarAds { get; set; }
        public virtual DbSet<SM> SMS { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<Test> Tests { get; set; }
        public virtual DbSet<test2> test2 { get; set; }
        public virtual DbSet<Test3> Test3 { get; set; }
        public virtual DbSet<Test4> Test4 { get; set; }
        public virtual DbSet<UsersExtraInfo> UsersExtraInfoes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdStatu>()
                .HasMany(e => e.Advertisements)
                .WithRequired(e => e.AdStatu)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.AdAttributeTransportations)
                .WithRequired(e => e.Advertisement)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.AdPrivileges)
                .WithRequired(e => e.Advertisement)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Advertisement>()
                .HasOptional(e => e.Price)
                .WithRequired(e => e.Advertisement);

            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.SimilarAds)
                .WithRequired(e => e.Advertisement)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<aspnet_Applications>()
                .HasMany(e => e.aspnet_Membership)
                .WithRequired(e => e.aspnet_Applications)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<aspnet_Applications>()
                .HasMany(e => e.aspnet_Paths)
                .WithRequired(e => e.aspnet_Applications)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<aspnet_Applications>()
                .HasMany(e => e.aspnet_Roles)
                .WithRequired(e => e.aspnet_Applications)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<aspnet_Applications>()
                .HasMany(e => e.aspnet_Users)
                .WithRequired(e => e.aspnet_Applications)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<aspnet_Paths>()
                .HasOptional(e => e.aspnet_PersonalizationAllUsers)
                .WithRequired(e => e.aspnet_Paths);

            modelBuilder.Entity<aspnet_Roles>()
                .HasMany(e => e.aspnet_Users)
                .WithMany(e => e.aspnet_Roles)
                .Map(m => m.ToTable("aspnet_UsersInRoles").MapLeftKey("RoleId").MapRightKey("UserId"));

            modelBuilder.Entity<aspnet_Users>()
                .HasMany(e => e.Advertisements)
                .WithRequired(e => e.aspnet_Users)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<aspnet_Users>()
                .HasOptional(e => e.aspnet_Membership)
                .WithRequired(e => e.aspnet_Users);

            modelBuilder.Entity<aspnet_Users>()
                .HasOptional(e => e.aspnet_Profile)
                .WithRequired(e => e.aspnet_Users);

            modelBuilder.Entity<aspnet_WebEvent_Events>()
                .Property(e => e.EventId)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<aspnet_WebEvent_Events>()
                .Property(e => e.EventSequence)
                .HasPrecision(19, 0);

            modelBuilder.Entity<aspnet_WebEvent_Events>()
                .Property(e => e.EventOccurrence)
                .HasPrecision(19, 0);

            modelBuilder.Entity<AspNetRole>()
                .HasMany(e => e.AspNetRoleClaims)
                .WithRequired(e => e.AspNetRole)
                .HasForeignKey(e => e.RoleId);

            modelBuilder.Entity<AspNetRole>()
                .HasMany(e => e.AspNetUsers)
                .WithMany(e => e.AspNetRoles)
                .Map(m => m.ToTable("AspNetUserRoles").MapLeftKey("RoleId").MapRightKey("UserId"));

            modelBuilder.Entity<AspNetUser>()
                .HasMany(e => e.AspNetUserClaims)
                .WithRequired(e => e.AspNetUser)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<AspNetUser>()
                .HasMany(e => e.AspNetUserLogins)
                .WithRequired(e => e.AspNetUser)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<Brand>()
                .HasMany(e => e.CarModels)
                .WithRequired(e => e.Brand)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Category>()
                .Property(e => e.categoryParentId)
                .IsFixedLength();

            modelBuilder.Entity<Category>()
                .HasMany(e => e.Advertisements)
                .WithRequired(e => e.Category)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<City>()
                .HasMany(e => e.Districts)
                .WithRequired(e => e.City)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<District>()
                .HasMany(e => e.Advertisements)
                .WithRequired(e => e.District)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Price>()
                .Property(e => e.price1)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Privilege>()
                .HasMany(e => e.AdPrivileges)
                .WithRequired(e => e.Privilege)
                .HasForeignKey(e => e.privilageId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<test2>()
                .Property(e => e.name)
                .IsFixedLength();
        }
    }
}
