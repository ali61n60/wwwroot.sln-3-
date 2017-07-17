using NUnit.Framework;
using Repository;
using Model.Advertisements;

namespace TestRepository2
{
    [TestFixture]
    class TestCategoryRepositoryInCode
    {
        

        [Test]
        public void WhenCalledFindById()
        {
            CategoryRepositoryInCode categoryRepository = new CategoryRepositoryInCode();

            Category testCategory = categoryRepository.FindCategoryById(1);

            testCategory = categoryRepository.FindCategoryById(1);
            Assert.AreEqual(1, testCategory.CategoryId);
        }

        [Test]
        public void WhenCalledGetAllChildernCategories()
        {
            CategoryRepositoryInCode categoryRepository = new CategoryRepositoryInCode();

            Category[] childCategories = categoryRepository.GetAllChildernCategories(-1);

            string h = "hellp";


            Assert.AreEqual(0, childCategories.Length);
        }

        [Test]
        public void WhenFindRootCategoryIsCalled()
        {
            CategoryRepositoryInCode categoryRepository = new CategoryRepositoryInCode();
            Category category = categoryRepository.FindCategoryById(100);
            int root = categoryRepository.FindRootParentCategoryById(category.CategoryId).CategoryId;
            Assert.AreEqual(2, root);

        }
    }

}
