using System.Collections.Generic;
using System.Data.SqlClient;
using ModelStd.Advertisements.Transportation;
using ModelStd.Db.Ad;
using ModelStd.IRepository;

namespace RepositoryStd.Repository.TransportationRepository
{
    public class TransportationRepository : ITransportaionRepository
    {
        private string _connectionString;
        public TransportationRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
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

        public TransportationModel[] GetAllModels()
        {
            string query = " SELECT CarModel.modelId, CarModel.modelName, CarModel.brandId " +
                            " FROM CarModel " +
                            " ORDER BY modelId ";
            List<TransportationModel> listOfTransportationModels = new List<TransportationModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.CommandText = query;
                    command.Connection = connection;
                    connection.Open();
                    var dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                    TransportationModel tempModel;
                    while (dataReader.Read())
                    {
                        tempModel = new TransportationModel((int)dataReader["modelId"], (string)dataReader["modelName"], (int)dataReader["brandId"]);
                        listOfTransportationModels.Add(tempModel);
                    }
                }
            }
            return listOfTransportationModels.ToArray();
        }
    }
}
