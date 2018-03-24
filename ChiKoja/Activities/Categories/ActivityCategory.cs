using System;
using System.Collections.Generic;
using System.Linq;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using ChiKoja.CustomViews.CategoryView;
using ChiKoja.Models;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository;
using ModelStd.Db.Ad;

namespace ChiKoja.Activities.Categories
{
    [Activity(Label = "ActivityCategory", Theme = "@style/Theme.Main")]
    public class ActivityCategory : NavActivity
    {
        //TODO improve code to add second level and third level automatically.Be ready for 4th level if data in category table has 4th level or more

        private readonly int ROOT_CATEGORY_ID = 0;//TODO move to xml settings
        private readonly CategoryRepository _categoryRepository=new CategoryRepository(Repository.Repository.DataBasePath);
        bool _selectedCategoryChanged;
        readonly List<int> _oldSelectedCategoryIds = new List<int>();
        readonly List<int> _currentSelectCategoryIds = new List<int>();
        List<SingleCategoryView> _allSingleCategoryViews;

        List<SingleCategoryView> _firstLevelCategoryViews;
        List<SingleCategoryView> _secondLevelCategoryViews;
        List<SingleCategoryView> _thirdLevelCategoryViews;

        LinearLayout _linearLayoutCategoryContainer;
        AppCompatButton _buttonOk;
        AppCompatButton _buttonCancel;
        AppCompatButton _buttonSelectAll;
        AppCompatButton _buttonClearAll;

        private CategorySelection _categorySelection;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.category);
            initializeFields();
            setSavedSelectedCategories();
            setOldSelectedCateoryIds();
        }
        private void initializeFields()
        {
            _linearLayoutCategoryContainer = FindViewById<LinearLayout>(Resource.Id.linearLayoutCategoryContainer);
            fillCategoryContainer();
            _buttonOk = FindViewById<AppCompatButton>(Resource.Id.buttonOk);
            _buttonOk.Click += buttonOk_Click;
            _buttonCancel = FindViewById<AppCompatButton>(Resource.Id.buttonCancel);
            _buttonCancel.Click += buttonCancel_Click;
            _buttonSelectAll = FindViewById<AppCompatButton>(Resource.Id.buttonSelectAll);
            _buttonSelectAll.Click += buttonSelectAll_Click;
            _buttonClearAll = FindViewById<AppCompatButton>(Resource.Id.buttonClearAll);
            _buttonClearAll.Click += buttonClearAll_Click;
        }
        private void fillCategoryContainer()
        {
            _firstLevelCategoryViews = new List<SingleCategoryView>();
            _secondLevelCategoryViews = new List<SingleCategoryView>();
            _thirdLevelCategoryViews = new List<SingleCategoryView>();
            
            Category[] allCategories = _categoryRepository.GetAll(Repository.Repository.Locker);
            addFirstLevelCategories(allCategories, ROOT_CATEGORY_ID);
            addSecondLevelCategories(allCategories);
            addThirdLevelCategories(allCategories);
        }
        private void addFirstLevelCategories(Category[] allCategories, int rootCategoryId)
        {
            IEnumerable<Category> firstLevelCategories = from category in allCategories
                                                                         where category.CategoryParentId == rootCategoryId
                                                                         select category;
            LinearLayout.LayoutParams layoutParams =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
            layoutParams.SetMargins(0, 0, 0, 10);
            foreach (Category category in firstLevelCategories)
            {
                SingleCategoryView singleCategoryView =
                    new SingleCategoryView(this, category, null);
                singleCategoryView.CategorySelectionChanged += singleCategoryView_CategorySelectionChanged;
                singleCategoryView.SetBackgroundColor(Resources.GetColor(Resource.Color.primaryDarkColor));
                _linearLayoutCategoryContainer.AddView(singleCategoryView, layoutParams);
                _firstLevelCategoryViews.Add(singleCategoryView);
            }
        }
        void singleCategoryView_CategorySelectionChanged(object sender, Category category)
        {
            updateSelectedCategoryChanged();
        }
        private void addSecondLevelCategories(Category[] allCategories)
        {
            LinearLayout.LayoutParams layoutParams =
               new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
            layoutParams.SetMargins(20, 0, 20, 10);
            foreach (SingleCategoryView firstLevelCategoryView in _firstLevelCategoryViews)
            {
                var childCategories = allCategories.Where(cat => cat.CategoryParentId == firstLevelCategoryView.GetCategory().CategoryId);
                foreach (Category childCategory in childCategories)
                {
                    SingleCategoryView singleCategoryView =
                        new SingleCategoryView(this, childCategory, firstLevelCategoryView);
                    singleCategoryView.SetBackgroundColor(Resources.GetColor(Resource.Color.primaryColor));
                    firstLevelCategoryView.AddChild(singleCategoryView, layoutParams);
                    _secondLevelCategoryViews.Add(singleCategoryView);
                }
            }
        }
        private void addThirdLevelCategories(Category[] allCategories)
        {
            LinearLayout.LayoutParams layoutParams =
               new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
            layoutParams.SetMargins(30, 0, 30, 10);
            foreach (SingleCategoryView secondLevelCategoryView in _secondLevelCategoryViews)
            {
                var childCategories = allCategories.Where(cat => cat.CategoryParentId== secondLevelCategoryView.GetCategory().CategoryId);
                foreach (Category childCategory in childCategories)
                {
                    SingleCategoryView singleCategoryView =
                        new SingleCategoryView(this, childCategory, secondLevelCategoryView);
                    singleCategoryView.SetBackgroundColor(Resources.GetColor(Resource.Color.secondaryDarkColor));
                    secondLevelCategoryView.AddChild(singleCategoryView, layoutParams);
                    _thirdLevelCategoryViews.Add(singleCategoryView);
                }
            }
        }
        void buttonOk_Click(object sender, EventArgs e)
        {
            Intent data = new Intent();
            saveSelectedCategoryIdsInRepository();
            data.PutExtra("categorySelectionChanged", _selectedCategoryChanged);
            SetResult(Result.Ok, data);
            Finish();
        }
        private void saveSelectedCategoryIdsInRepository()
        {
            //IEnumerable<int> selectedCategoryIds= (from singleCategoryView in _allSingleCategoryViews where singleCategoryView.IsSelected() select singleCategoryView.GetCategory().CategoryId);
           // _categoryRepository.CategoryId=selectedCategoryIds;
        }
        void buttonCancel_Click(object sender, EventArgs e)
        {
            SetResult(Result.Canceled);
            Finish();
        }
        void buttonSelectAll_Click(object sender, EventArgs e)
        {
            _allSingleCategoryViews.ForEach(view => view.SetSelect(true));
            updateSelectedCategoryChanged();
        }
        private void updateSelectedCategoryChanged()
        {
            updateCurrentSelectedCateoryIds();
            _selectedCategoryChanged = !_currentSelectCategoryIds.SequenceEqual(_oldSelectedCategoryIds);
        }
        private void updateCurrentSelectedCateoryIds()
        {
            _currentSelectCategoryIds.Clear();
            foreach (SingleCategoryView singleCategoryView in _allSingleCategoryViews)
            {
                if (singleCategoryView.IsSelected())
                    _currentSelectCategoryIds.Add(singleCategoryView.GetCategory().CategoryId);
            }
            _currentSelectCategoryIds.Sort((id1, id2) =>
            {
                if (id1 > id2)
                    return 1;
                else if (id1 < id2)
                    return -1;
                return 0;
            });
        }
        void buttonClearAll_Click(object sender, EventArgs e)
        {
            _allSingleCategoryViews.ForEach(view => view.SetSelect(false));
            updateSelectedCategoryChanged();
        }
        private void setSavedSelectedCategories()
        {
            //IEnumerable<int> selectedCategoryIds = _categoryRepository.CategoryId;
            initializeAllSingleCategoryView();
            //foreach (int categoryId in selectedCategoryIds)
            //{
            //    selectSingleCategoryView(_allSingleCategoryViews, categoryId);
            //}
        }
        private void initializeAllSingleCategoryView()
        {
            _allSingleCategoryViews = new List<SingleCategoryView>();
            for (int i = 0; i < _linearLayoutCategoryContainer.ChildCount; i++)
            {
                var firstLevelSingleCategoryView = (SingleCategoryView)_linearLayoutCategoryContainer.GetChildAt(i);//first level
                _allSingleCategoryViews.Add(firstLevelSingleCategoryView);
                List<SingleCategoryView> secondLevelCategoryViews = firstLevelSingleCategoryView.GetChildren();//second level
                foreach (SingleCategoryView secondLevelCategoryView in secondLevelCategoryViews)
                {
                    _allSingleCategoryViews.Add(secondLevelCategoryView);
                    List<SingleCategoryView> thirdLevelCategoryViews = secondLevelCategoryView.GetChildren();//third level
                    _allSingleCategoryViews.AddRange(thirdLevelCategoryViews);
                }
            }
        }
        private void selectSingleCategoryView(List<SingleCategoryView> allSingleCategoryViews, int categoryId)
        {
            SingleCategoryView singleCategoryView = allSingleCategoryViews.Find(view => view.GetCategory().CategoryId == categoryId);
            if (singleCategoryView != null)
            {
                singleCategoryView.SetSelect(true);
                allSingleCategoryViews.Remove(singleCategoryView);
            }
        }
       
        private void setOldSelectedCateoryIds()
        {
            _oldSelectedCategoryIds.Clear();
            foreach (SingleCategoryView singleCategoryView in _allSingleCategoryViews)
            {
                if (singleCategoryView.IsSelected())
                     _oldSelectedCategoryIds.Add(singleCategoryView.GetCategory().CategoryId);
            }
            _oldSelectedCategoryIds.Sort((id1, id2) =>
            {
                if (id1 > id2)
                    return 1;
                else if (id1 < id2)
                    return -1;
                return 0;
            });
        }
    }
}