namespace ModelStd.Advertisements
{
    public  class Category
    {
        public int CategoryId{get; internal set; }
        public int ParentCategoryId{get; internal set; }
        public string CategoryName { get; internal set; }
        public string EnglishCategoryName { get; internal set; }
        public Category(int categoryId, int parentCategoryId, string categoryName, string englishCategoryName)
        {
            CategoryId = categoryId;
            ParentCategoryId = parentCategoryId;
            CategoryName = categoryName;
            EnglishCategoryName = englishCategoryName;
        }
    }
}
