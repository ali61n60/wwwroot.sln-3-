using System;
using System.Collections.Generic;
using ModelStd.Db.Ad;

namespace ChiKoja.Models
{
    public class CategorySelection:ICriteria
    {
        private int _selectedCategoryId=0;//TODO set it from user pref or set it to default 
        public int SelectedCategoryId
        {
            get => _selectedCategoryId;
            set
            {
                if (value != _selectedCategoryId)
                {
                    _selectedCategoryId = value;
                    onSelectedCategoryChanged(_selectedCategoryId);
                }
            }
        }

        private void onSelectedCategoryChanged(int selectedCategory)
        {
            if (SelectedCategoryCahnged != null)
            {
                SelectedCategoryCahnged(this,new CategoryCahngedEventArg
                {
                    SelectedCategoryId = selectedCategory,
                    SelectedCategoryHasChild = false
                });
            }
        }

        public event SelectedCayegoryChanged SelectedCategoryCahnged;
        public void FillCriteria(Dictionary<string, string> userInput)
        {
             userInput.Add(Category.CategoryIdKey,_selectedCategoryId.ToString());
        }
    }


   
    public class CategoryCahngedEventArg : EventArgs
    {
        public int SelectedCategoryId;
        public bool SelectedCategoryHasChild;
    }

    public delegate void SelectedCayegoryChanged(object sender, CategoryCahngedEventArg args);


}