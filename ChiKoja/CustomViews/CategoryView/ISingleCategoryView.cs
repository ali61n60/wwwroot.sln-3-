using System;
using System.Collections.Generic;
using Android.Widget;
using ModelStd.Advertisements;

namespace ChiKoja.CustomViews.CategoryView
{
    public interface ISingleCategoryView
    {
        event CategorySelctionHandler CategorySelectionChanged;
        bool IsSelected();
        void SetSelect(bool select);
        void AddChild(SingleCategoryView childSingleCategoryView, LinearLayout.LayoutParams layoutParams);
        Category GetCategory();
        SingleCategoryView GetParent();
        bool HasChildren();
        bool ChildrenAreVisible();
        List<SingleCategoryView> GetChildren();
    }

    public delegate void CategorySelctionHandler(Object sender, Category category);
}