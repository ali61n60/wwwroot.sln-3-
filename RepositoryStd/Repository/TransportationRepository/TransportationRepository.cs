using System.Collections.Generic;
using System.Data.SqlClient;
using ModelStd.Advertisements.Transportation;
using ModelStd.IRepository;

namespace RepositoryStd.Repository.TransportationRepository
{
    public class TransportationRepository : ITransportaionRepository
    {
        public Vehicle[] GetAllVehicles(string conectionString)
        {
            string query = " SELECT CarModel.modelName,CarModel.modelId,Brands.brandName,CarModel.brandId " +
                           " FROM CarModel inner join Brands ON CarModel.brandId=Brands.brandId " +
                           " ORDER BY brandId ";
            List<Vehicle> searchResultItems = new List<Vehicle>();

            using (SqlConnection connection = new SqlConnection(conectionString))
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

        public TransportationBrand[] GetAllBrands(string conectionString)
        {
            string query = " SELECT Brands.brandId,Brands.brandName " +
                            " FROM Brands " +
                            " ORDER BY brandId ";
            List<TransportationBrand> listOfTransportationBrands = new List<TransportationBrand>();

            using (SqlConnection connection = new SqlConnection(conectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.CommandText = query;
                    command.Connection = connection;
                    connection.Open();
                    var dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                    TransportationBrand tempBrand;
                    while (dataReader.Read())
                    {
                        tempBrand = new TransportationBrand((int)dataReader["brandId"], (string)dataReader["brandName"]);
                        listOfTransportationBrands.Add(tempBrand);
                    }
                }
            }
            return listOfTransportationBrands.ToArray();
        }

        public TransportationModel[] GetAllModels(string conectionString)
        {
            string query = " SELECT CarModel.modelId, CarModel.modelName, CarModel.brandId " +
                            " FROM CarModel " +
                            " ORDER BY modelId ";
            List<TransportationModel> listOfTransportationModels = new List<TransportationModel>();
            using (SqlConnection connection = new SqlConnection(conectionString))
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
                        tempModel = new TransportationModel((int)dataReader["modelId"],(string)dataReader["modelName"],(int)dataReader["brandId"]);
                        listOfTransportationModels.Add(tempModel);
                    }
                }
            }
            return listOfTransportationModels.ToArray();
        }
    }
}
