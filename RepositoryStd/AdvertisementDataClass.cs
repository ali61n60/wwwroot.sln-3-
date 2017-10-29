 namespace RepositoryStd
{
    public class AdvertisementDataClass
    {
        public string ConnectionString { get;}

        public AdvertisementDataClass(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public static string DefaultConnectionString()
        {
            return "Data Source= .\\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801;MultipleActiveResultSets=true";
        }
    }
}
