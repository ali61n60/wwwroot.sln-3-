using System.Collections.Generic;
using System.Data.SqlClient;
using ModelStd.Advertisements.Transportation;
using ModelStd.Db.Ad;
using ModelStd.IRepository;

namespace RepositoryStd.Repository.Transportation
{
    //TODO merge this class into AdvertisementTransportationRepository
    public class TransportationRepository : ITransportaionRepository
    {
        private string _connectionString;
        public TransportationRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        //TODO use EF
        public Vehicle[] GetAllVehicles()
        {
            string query = " SELECT CarModel.modelName,CarModel.modelId,Brands.brandName,CarModel.brandId " +
                           " FROM CarModel inner join Brands ON CarModel.brandId=Brands.brandId " +
                           " ORDER BY brandId ";
            List<Vehicle> searchResultItems = new List<Vehicle>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.CommandText = query;
                    command.Connection = connection;
                    connection.Open();
                    var dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                    Vehicle tempVehicle;
                    while (dataReader.Read())
                    {

                        tempVehicle = new Vehicle((int)dataReader["modelId"],
                                                  (string)dataReader["modelName"],
                                                  (int)dataReader["brandId"],
                                                  (string)dataReader["brandName"]);
                        searchResultItems.Add(tempVehicle);
                    }
                }
            }

            return searchResultItems.ToArray();
        }

        //TODO use EF
        public IEnumerable<Brand> GetAllBrands()
        {
            string query = " SELECT ad.Brands.brandId,ad.Brands.brandName " +
                            " FROM ad.Brands " +
                            " ORDER BY brandId ";
            List<Brand> listOfTransportationBrands = new List<Brand>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.CommandText = query;
                    command.Connection = connection;
                    connection.Open();
                    var dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                    Brand tempBrand;
                    while (dataReader.Read())
                    {
                        tempBrand = new Brand
                        {
                            BrandId = (int) dataReader["brandId"],
                            BrandName = (string) dataReader["brandName"]
                        };
                        listOfTransportationBrands.Add(tempBrand);
                    }
                }
            }
            return listOfTransportationBrands;
        }

        //TODO use EF
        public IEnumerable<CarModel> GetAllModels()
        {
            string query = " SELECT ad.CarModel.modelId, ad.CarModel.modelName, ad.CarModel.brandId " +
                            " FROM ad.CarModel " +
                            " ORDER BY modelId ";
            List<CarModel> listOfTransportationModels = new List<CarModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.CommandText = query;
                    command.Connection = connection;
                    connection.Open();
                    var dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                    CarModel tempModel;
                    while (dataReader.Read())
                    {
                        tempModel = new CarModel{
                            ModelId = (int) dataReader["modelId"],
                            ModelName = (string) dataReader["modelName"],
                            BrandId = (int) dataReader["brandId"]
                        };
                        
                        listOfTransportationModels.Add(tempModel);
                    }
                }
            }
            return listOfTransportationModels;
        }
    }
}
