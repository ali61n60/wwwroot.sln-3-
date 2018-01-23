using System.Collections.Generic;
using ModelStd.Db.Ad;

namespace ModelStd.IRepository
{
    public interface ICategoryRepository
    {
        int CategoryVersion { get;}

        Category FindCategoryById(int categoryId);

        IList<Category> GetAllCategories();

        IList<Category> GetAllChildernCategories(int parentCategoryId);

        Category FindCategoryByEnglishName(string englishCategoryName);

        Category FindParentCategoryById(int categoryId);

        Category FindRootParentCategoryById(int categoryId);
    }
}
