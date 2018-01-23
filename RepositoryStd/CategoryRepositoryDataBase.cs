using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using ModelStd.Advertisements.CustomExceptions;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using RepositoryStd.Context.AD;

namespace RepositoryStd
{
    public class CategoryRepositoryDataBase : ICategoryRepository
    {
        private readonly AdDbContext _adDbContext;

        public int CategoryVersion { get { return 1; } }
       


        public CategoryRepositoryDataBase(AdDbContext adDbContext)
        {
            _adDbContext = adDbContext;
        }
        
        public Category FindCategoryById(int CategoryId)
        {
            return _adDbContext.Categories.FirstOrDefault(category => category.CategoryId == CategoryId);
        }

        public IList<Category> GetAllCategories()
        {
            return _adDbContext.Categories.ToList();
        }

        public IList<Category> GetAllChildernCategories(int ParentCategoryId)
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
