using System;
using System.Data.SqlClient;
using ModelStd.Advertisements;
using ModelStd.IRepository;

namespace RepositoryStd
{
    

   public class CategoryRepositoryDataBase : ICategoryRepository
    {
        private readonly string _conectionString;

        public int CategoryVersion { get { return 1; } }
        public CategoryRepositoryDataBase()
            : this(AdvertisementDataClass.GetConnectionString()) { }


        public CategoryRepositoryDataBase(string connectionString)
        {
            _conectionString = connectionString;
        }

       

        public Category FindCategoryById(int CategoryId)
        {
            Category tempCategory;
            SqlDataReader dataReader;
            SqlConnection connection = new SqlConnection(_conectionString);
            SqlCommand command = new SqlCommand("SELECT  categoryId, categoryName, categoryParentId, categoryNameEnglish " +
                                                 " FROM   Categories WHERE categoryId=@CategoryId  ", connection);
            command.Parameters.Add("@CategoryId", System.Data.SqlDbType.Int).Value = CategoryId;
            try
            {
                connection.Open();
                dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                if (dataReader.Read())
                {
                    tempCategory=new Category((int) dataReader["categoryId"],
                         (int)dataReader["categoryParentId"],
                        (string)dataReader["categoryName"],
                        (string)dataReader["categoryNameEnglish"]);
                }
                else
                {
                    throw new CategoryNotFoundException();
                }
                
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
            }
            return tempCategory;
        }

        public Category[] GetAllCategories()
        {
            throw new Exception();
        }

        public Category[] GetAllChildernCategories(int ParentCategoryId)
        {
            throw new Exception();
        }

        public Category FindCategoryByEnglishName(string EnglishCategoryName)
        {
            throw new NotImplementedException();
        }

       public Category FindParentCategoryById(int categoryId)
       {
           throw new NotImplementedException();
       }

       public Category FindRootParentCategoryById(int categoryId)
       {
           throw new NotImplementedException();
       }
    }
}
