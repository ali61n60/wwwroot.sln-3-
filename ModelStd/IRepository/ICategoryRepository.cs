using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ModelStd.Advertisements;

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
