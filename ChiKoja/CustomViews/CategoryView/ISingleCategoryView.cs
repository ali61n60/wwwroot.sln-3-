using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace ChiKoja.CustomViews.CategoryView
{
    public interface ISingleCategoryView
    {
        event CategorySelctionHandler CategorySelectionChanged;
        bool IsSelected();
        void SetSelect(bool select);
        void AddChild(SingleCategoryView childSingleCategoryView, LinearLayout.LayoutParams layoutParams);
        CategoryService.Category GetCategory();
        SingleCategoryView GetParent();
        bool HasChildren();
        bool ChildrenAreVisible();
        List<SingleCategoryView> GetChildren();
    }

    public delegate void CategorySelctionHandler(Object sender, CategoryService.Category category);
}