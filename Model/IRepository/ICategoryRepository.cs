using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model.Advertisements;

namespace Model.IRepository
{
    public interface ICategoryRepository
    {
        int CategoryVersion { get;}

        Category FindCategoryById(int CategoryId);

        Category[] GetAllCategories();

        Category[] GetAllChildernCategories(int ParentCategoryId);

        Category FindCategoryByEnglishName(string EnglishCategoryName);

        Category FindParentCategoryById(int categoryId);

        Category FindRootParentCategoryById(int categoryId);

        

    }
}
