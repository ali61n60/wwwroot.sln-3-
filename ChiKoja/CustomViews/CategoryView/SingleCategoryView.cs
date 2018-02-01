using System.Collections.Generic;
using System.Linq;
using Android.Content;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;


namespace ChiKoja.CustomViews.CategoryView
{
    
    public class SingleCategoryView : LinearLayout,ISingleCategoryView
    {
        //TODO add a sign to tell user some of children of a category are selected
        //TODOD add CheckBoxTriState instead of checkBoxSelectCategory
        View mainView;
        TextView textViewCategoryName;
        CheckBox checkBoxSelectCategory;
        ImageView imageViewHasChildrenSign;
        RelativeLayout relativeLayoutMain;
        LinearLayout linearLayoutChildrenContainer;

        private readonly List<SingleCategoryView> _childrenList=new List<SingleCategoryView>(); 
        private readonly SingleCategoryView _parent; 
        private readonly Category _category;
        private bool _childrenAreVisible;
        
        public event CategorySelctionHandler CategorySelectionChanged;

        public SingleCategoryView(Context context, Category category, SingleCategoryView parent)
            : base(context)
        {
            _category = category;
            _parent = parent;
            initializeViews();
        }
        private void initializeViews()
        {
            initializeMainView();
            initializeTextView();
            initializeCheckBox();
            initialzeImageView();
            initializeChildContainer();
        }
        private void initializeMainView()
        {
            var layoutInflater = (LayoutInflater)Context.GetSystemService(Context.LayoutInflaterService);
            mainView = layoutInflater.Inflate(Resource.Layout.SingleCategory, this, true);
            relativeLayoutMain = mainView.FindViewById<RelativeLayout>(Resource.Id.relativeLayout1);
        }
        private void initializeTextView()
        {
            textViewCategoryName = mainView.FindViewById<TextView>(Resource.Id.textViewCategoryName);
            textViewCategoryName.Text = _category.CategoryName;
            textViewCategoryName.Click += (sender, args) =>
            {
                if (!HasChildren())
                    return;
                if(_childrenAreVisible)
                {
                    linearLayoutChildrenContainer.Visibility = ViewStates.Gone;
                    _childrenAreVisible = false;
                }
                else
                {
                    linearLayoutChildrenContainer.Visibility = ViewStates.Visible;
                    _childrenAreVisible = true;
                }
            };
        }
        private void initializeCheckBox()
        {
            checkBoxSelectCategory = mainView.FindViewById<CheckBox>(Resource.Id.checkBoxSelectCategoryAndAllChildren);
            checkBoxSelectCategory.Click += (o, s) =>
            {
                notifyParentAndAllChldren();
                if (CategorySelectionChanged != null)
                {
                    CategorySelectionChanged(this, _category);
                }
            };
        }
        private void parentChanged(bool parentIsSelected)
        {
            bool previousSelectStatus = IsSelected();
            SetSelect(parentIsSelected);
            if (previousSelectStatus != IsSelected())
            {
                foreach (SingleCategoryView singleCategoryView in _childrenList)
                    singleCategoryView.parentChanged(IsSelected());
            }
        }
        private void childChanged()
        {
            //if all children are selected also select this else deselect this
            SetSelect(_childrenList.All(view => view.IsSelected()));
            if(_parent!=null)
                _parent.childChanged();
        }
        private void initialzeImageView()
        {
            imageViewHasChildrenSign = mainView.FindViewById<ImageView>(Resource.Id.imageViewHasChildrenSign);
            imageViewHasChildrenSign.SetImageResource(Resource.Drawable.arrowLeft2);
        }
        private void initializeChildContainer()
        {
            _childrenAreVisible = false;
            linearLayoutChildrenContainer = mainView.FindViewById<LinearLayout>(Resource.Id.linearLayoutChildrenContainer);
            linearLayoutChildrenContainer.Visibility = ViewStates.Gone;
        }
        public override void SetBackgroundColor(Color color)
        {
            relativeLayoutMain.SetBackgroundColor(color);
        }
        public List<SingleCategoryView> GetChildren()
        {
            return _childrenList;
        }
        public bool IsSelected()
        {
            return checkBoxSelectCategory.Checked; 
        }
        public void SetSelect(bool select)
        {
            checkBoxSelectCategory.Checked = select;
        }
        private void notifyParentAndAllChldren()
        {
            foreach (SingleCategoryView child in _childrenList)
            {
                child.parentChanged(IsSelected());
            }

            if (_parent != null)
                _parent.childChanged();
        }
        public void AddChild(SingleCategoryView childSingleCategoryView,LayoutParams layoutParams)
        {
            linearLayoutChildrenContainer.AddView(childSingleCategoryView, layoutParams);
            _childrenList.Add(childSingleCategoryView);
            updateHasChildrenSign();
        }
        private void updateHasChildrenSign()
        {
            if (HasChildren())
                imageViewHasChildrenSign.SetImageResource(Resource.Drawable.arrowDown2);
        }
        public Category GetCategory()
        {
            return _category;
        }
        public SingleCategoryView GetParent()
        {
            return _parent;
        }
        public bool HasChildren()
        {
            return _childrenList.Count > 0;
        }
        public bool ChildrenAreVisible()
        {
            return _childrenAreVisible;
        }
    }
}