using System.Collections.Generic;
using ModelStd.Db.Ad;

namespace ModelStd.IRepository
{
    public interface ICategoryRepository
    {
        int CategoryVersion { get;}

        Category FindCategoryById(int CategoryId);

        IList<Category> GetAllCategories();

        IList<Category> GetAllChildernCategories(int ParentCategoryId);

        Category FindCategoryByEnglishName(string EnglishCategoryName);

        Category FindParentCategoryById(int categoryId);

        Category FindRootParentCategoryById(int categoryId);
    }
}
