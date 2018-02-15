using System.Collections.Generic;
using ModelStd.Db.Ad;
using ModelStd.IRepository;

namespace RepositoryStd
{
    public class CategoryRepositoryInCode : ICategoryRepository
    {
        private List<Category> allCategories;
        public int CategoryVersion => 1;


        public CategoryRepositoryInCode()
        {
            fillAllCategories();
        }

        public Category FindCategoryById(int CategoryId)
        {
            Category tempCategory = null;
            foreach (Category category in allCategories)
            {
                if (category.CategoryId == CategoryId)
                {
                    tempCategory = category;
                    break;
                }
            }
            return tempCategory;
        }

        public IList<Category> GetAllCategories()
        {
            
            return allCategories;
        }

        public IList<Category> GetAllChildernCategories(int ParentCategoryId)
        {
            List<Category> tempList = new List<Category>();
            foreach (Category category in allCategories)
            {
                if (category.CategoryParentId == ParentCategoryId)
                {
                    tempList.Add(category);
                }
            }
            return tempList;
        }

        public Category FindCategoryByEnglishName(string EnglishCategoryName)
        {
            Category tempCategory = null;
            foreach (Category category in allCategories)
            {
                if (category.CategoryNameEnglish == EnglishCategoryName)
                {
                    tempCategory = category;
                    break;
                }
            }
            return tempCategory;
        }

        public Category FindParentCategoryById(int categoryId)
        {
            Category tempCategory = null;
            foreach (Category category in allCategories)
            {
                if (category.CategoryId == categoryId)
                {
                    tempCategory = this.FindCategoryById(category.CategoryParentId);
                    break;
                }
            }
            return tempCategory;
        }

        public Category FindRootParentCategoryById(int categoryId)
        {
            Category temCategory = findCategoryById(categoryId);
            Category rootParentCategory = null;
            while (temCategory != null)
            {
                if (temCategory.CategoryParentId == 0)
                {
                    rootParentCategory = temCategory;
                    break;
                }
                else
                {
                    temCategory = findCategoryById(temCategory.CategoryParentId);
                }
            }

            return rootParentCategory;
        }

        private Category findCategoryById(int categoryId)
        {
            Category tempCategory = null;
            foreach (Category category in allCategories)
            {
                if (category.CategoryId == categoryId)
                {
                    tempCategory = category;
                    break;
                }
            }
            return tempCategory;
        }

        private void fillAllCategories()
        {
            allCategories = new List<Category>();

            allCategories.Add(new Category() { CategoryId = 0, CategoryParentId = 0, CategoryName = "تمام آگهی ها", CategoryNameEnglish = "All Categories" });
            allCategories.Add(new Category() { CategoryId = 1, CategoryParentId = 0, CategoryName = "املاک", CategoryNameEnglish = "Estate" });
            allCategories.Add(new Category() { CategoryId = 2, CategoryParentId = 0, CategoryName = "وسایل نقلیه", CategoryNameEnglish = "Transportation" });
            allCategories.Add(new Category() { CategoryId = 3, CategoryParentId = 0, CategoryName = "استخدام و کاریابی", CategoryNameEnglish = "Recruitment" });
            allCategories.Add(new Category() { CategoryId = 4, CategoryParentId = 0, CategoryName = "مربوط به خانه", CategoryNameEnglish = "Housing" });
            allCategories.Add(new Category() { CategoryId = 5, CategoryParentId = 0, CategoryName = "خدمات", CategoryNameEnglish = "Services" });
            allCategories.Add(new Category() { CategoryId = 6, CategoryParentId = 0, CategoryName = "وسایل شخصی", CategoryNameEnglish = "PersonalStuff" });
            allCategories.Add(new Category() { CategoryId = 7, CategoryParentId = 0, CategoryName = "لوازم الکترونیکی", CategoryNameEnglish = "Electronics" });
            allCategories.Add(new Category() { CategoryId = 8, CategoryParentId = 0, CategoryName = "سرگرمی و فراغت", CategoryNameEnglish = "Entertainment" });
            allCategories.Add(new Category() { CategoryId = 9, CategoryParentId = 0, CategoryName = "اجتماعی", CategoryNameEnglish = "Social" });
            allCategories.Add(new Category() { CategoryId = 10, CategoryParentId = 0, CategoryName = "برای کسب و کار", CategoryNameEnglish = "Business" });
            allCategories.Add(new Category() { CategoryId = 11, CategoryParentId = 1, CategoryName = "خدمات املاک", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 12, CategoryParentId = 1, CategoryName = "فروش مسکونی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 13, CategoryParentId = 1, CategoryName = "اجاره مسکونی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 14, CategoryParentId = 1, CategoryName = "فروش اداری و تجاری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 15, CategoryParentId = 1, CategoryName = "اجاره اداری و تجاری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 16, CategoryParentId = 1, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 17, CategoryParentId = 2, CategoryName = "خودرو", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 18, CategoryParentId = 2, CategoryName = "قطعات یدکی و لوازم جانبی خودرو", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 19, CategoryParentId = 2, CategoryName = "قایق و لوازم جانبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 20, CategoryParentId = 2, CategoryName = "موتور سیکلت و لوازم جانبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 21, CategoryParentId = 2, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 22, CategoryParentId = 3, CategoryName = "اداری و مدیریت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 23, CategoryParentId = 3, CategoryName = "معماری و ساختمانی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 24, CategoryParentId = 3, CategoryName = "رایانه و فناوری اطلاعات", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 25, CategoryParentId = 3, CategoryName = "مالی و حسابداری و حقوقی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 26, CategoryParentId = 3, CategoryName = "بازاریابی و فروش", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 27, CategoryParentId = 3, CategoryName = "صنعتی و فنی و مهندسی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 28, CategoryParentId = 3, CategoryName = "آموزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 29, CategoryParentId = 3, CategoryName = "حمل و نقل", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 30, CategoryParentId = 3, CategoryName = "درمانی و زیبایی و بهداشتی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 31, CategoryParentId = 3, CategoryName = "هنری و رسانه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 32, CategoryParentId = 3, CategoryName = "خدمات فروشگاه و رستوران", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 33, CategoryParentId = 3, CategoryName = "سرایداری و نظافت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 34, CategoryParentId = 3, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 35, CategoryParentId = 4, CategoryName = "ساختمان و حیاط", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 36, CategoryParentId = 4, CategoryName = "وسایل و تزیینات خانه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 37, CategoryParentId = 4, CategoryName = "وسایل آشپزخانه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 38, CategoryParentId = 4, CategoryName = "ابزار", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 39, CategoryParentId = 4, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 40, CategoryParentId = 5, CategoryName = "موتور و ماشین", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 41, CategoryParentId = 5, CategoryName = "پذیرایی و مراسم", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 42, CategoryParentId = 5, CategoryName = "خدمات رایانه و موبایل", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 43, CategoryParentId = 5, CategoryName = "مالی، حسابداری و بیمه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 44, CategoryParentId = 5, CategoryName = "حمل و نقل", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 45, CategoryParentId = 5, CategoryName = "پیشه و مهارت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 46, CategoryParentId = 5, CategoryName = "آرایشگری و زیبایی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 47, CategoryParentId = 5, CategoryName = "سرگرمی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 48, CategoryParentId = 5, CategoryName = "نظافت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 49, CategoryParentId = 5, CategoryName = "باغبانی و درختکاری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 50, CategoryParentId = 5, CategoryName = "آموزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 51, CategoryParentId = 5, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 52, CategoryParentId = 6, CategoryName = "کیف، کفش و لباس", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 53, CategoryParentId = 6, CategoryName = "تزیینی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 54, CategoryParentId = 6, CategoryName = "کفش و لباس بچه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 55, CategoryParentId = 6, CategoryName = "وسایل بچه و اسباب بازی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 56, CategoryParentId = 6, CategoryName = "آرایشی، بهداشتی و درمانی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 57, CategoryParentId = 6, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 58, CategoryParentId = 7, CategoryName = "رایانه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 59, CategoryParentId = 7, CategoryName = "صوتی و تصویری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 60, CategoryParentId = 7, CategoryName = "موبایل و تبلت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 61, CategoryParentId = 7, CategoryName = "کنسول بازی ویدئویی و آنلاین", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 62, CategoryParentId = 7, CategoryName = "دستگاه تلفن", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 63, CategoryParentId = 7, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 64, CategoryParentId = 8, CategoryName = "بلیط", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 65, CategoryParentId = 8, CategoryName = "کتاب و مجله", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 66, CategoryParentId = 8, CategoryName = "دوچرخه، اسکیت و اسکوتر", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 67, CategoryParentId = 8, CategoryName = "حیوانات", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 68, CategoryParentId = 8, CategoryName = "کلکسیون و سرگرمی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 69, CategoryParentId = 8, CategoryName = "آلات موسیقی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 70, CategoryParentId = 8, CategoryName = "ورزش و تناسب اندام", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 71, CategoryParentId = 8, CategoryName = "اسباب بازی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 72, CategoryParentId = 8, CategoryName = "تور و چارتر", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 73, CategoryParentId = 8, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 74, CategoryParentId = 9, CategoryName = "رویداد", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 75, CategoryParentId = 9, CategoryName = "داوطلبانه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 76, CategoryParentId = 9, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 77, CategoryParentId = 10, CategoryName = "تجهیزات و ماشین آلات", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 78, CategoryParentId = 10, CategoryName = "عمده فروشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 79, CategoryParentId = 10, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 80, CategoryParentId = 11, CategoryName = "آژانس املاک", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 81, CategoryParentId = 11, CategoryName = "مشارکت در ساخت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 82, CategoryParentId = 11, CategoryName = "امور مالی و حقوقی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 83, CategoryParentId = 11, CategoryName = "پیش فروش", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 84, CategoryParentId = 11, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 85, CategoryParentId = 12, CategoryName = "آپارتمان", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 86, CategoryParentId = 12, CategoryName = "خانه و ویلایی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 87, CategoryParentId = 12, CategoryName = "زمین و کلنگی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 88, CategoryParentId = 12, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 89, CategoryParentId = 13, CategoryName = "آپارتمان", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 90, CategoryParentId = 13, CategoryName = "خانه و ویلا", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 91, CategoryParentId = 13, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 92, CategoryParentId = 14, CategoryName = "دفتر کار، اتاق اداری و مطب", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 93, CategoryParentId = 14, CategoryName = "مغازه و غرفه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 94, CategoryParentId = 14, CategoryName = "صنعتی، کشاورزی و تجاری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 95, CategoryParentId = 14, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 96, CategoryParentId = 15, CategoryName = "دفتر کار، اتاق اداری و مطب", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 97, CategoryParentId = 15, CategoryName = "مغازه و غرفه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 98, CategoryParentId = 15, CategoryName = "صنعتی، کشاورزی و تجاری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 99, CategoryParentId = 15, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 100, CategoryParentId = 17, CategoryName = "سواری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 101, CategoryParentId = 17, CategoryName = "سنگین", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 102, CategoryParentId = 17, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 103, CategoryParentId = 35, CategoryName = "سرویس بهداشتی و سونا", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 104, CategoryParentId = 35, CategoryName = "سیستم گرمایشیو سرمایشی و گاز", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 105, CategoryParentId = 35, CategoryName = "آشپزخانه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 106, CategoryParentId = 35, CategoryName = "حیاط و ایوان", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 107, CategoryParentId = 35, CategoryName = "ابزار باغبانی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 108, CategoryParentId = 35, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 109, CategoryParentId = 36, CategoryName = "تزیینی و آثار هنری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 110, CategoryParentId = 36, CategoryName = "لوازم روشنایی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 111, CategoryParentId = 36, CategoryName = "میز و صندلی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 112, CategoryParentId = 36, CategoryName = "فرش و گلیم", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 113, CategoryParentId = 36, CategoryName = "کمد و بوفه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 114, CategoryParentId = 36, CategoryName = "پرده و رومیزی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 115, CategoryParentId = 36, CategoryName = "تخت و اتاق خواب", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 116, CategoryParentId = 36, CategoryName = "مبلمان و صندلی راحتی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 117, CategoryParentId = 36, CategoryName = "میز تلوزیون و وسایل سیستم پخش", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 118, CategoryParentId = 36, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 119, CategoryParentId = 37, CategoryName = "ماشین ظرفشویی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 120, CategoryParentId = 37, CategoryName = "یخچال و فریزر", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 121, CategoryParentId = 37, CategoryName = "وسایل آشپزی و غذا خوری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 122, CategoryParentId = 37, CategoryName = "مایکروویو و گاز", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 123, CategoryParentId = 37, CategoryName = "ماشین لباسشویی و خشک کننده", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 124, CategoryParentId = 37, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 125, CategoryParentId = 38, CategoryName = "نظافت و خیاطی و اتو", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 126, CategoryParentId = 38, CategoryName = "تعمیرات", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 127, CategoryParentId = 38, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 128, CategoryParentId = 42, CategoryName = "فروش دامنه و سایت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 129, CategoryParentId = 42, CategoryName = "میزبانی و طراحی سایت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 130, CategoryParentId = 42, CategoryName = "خدمات پهنای باند اینترنت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 131, CategoryParentId = 42, CategoryName = "خدمات نزم افزار و سخت افزار کامپیوتر", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 132, CategoryParentId = 42, CategoryName = "تعمیرات نرم افزار و سخت افزار گوشی موبایل", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 133, CategoryParentId = 42, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 134, CategoryParentId = 50, CategoryName = "زبان خارجی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 135, CategoryParentId = 50, CategoryName = "دروس مدرسه و دانشگاه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 136, CategoryParentId = 50, CategoryName = "نرم افزار", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 137, CategoryParentId = 50, CategoryName = "هنری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 138, CategoryParentId = 50, CategoryName = "ورزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 139, CategoryParentId = 50, CategoryName = "مشاوره تحصیلی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 140, CategoryParentId = 50, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 141, CategoryParentId = 52, CategoryName = "کیف، کفش و کمربند", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 142, CategoryParentId = 52, CategoryName = "لباس", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 143, CategoryParentId = 52, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 144, CategoryParentId = 53, CategoryName = "ساعت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 145, CategoryParentId = 53, CategoryName = "جواهرات", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 146, CategoryParentId = 53, CategoryName = "بدلیجات", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 147, CategoryParentId = 53, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 148, CategoryParentId = 55, CategoryName = "اسباب بازی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 149, CategoryParentId = 55, CategoryName = "کالسکه و لوازم جانبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 150, CategoryParentId = 55, CategoryName = "صندلی بچه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 151, CategoryParentId = 55, CategoryName = "اسباب و اثاث بچه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 152, CategoryParentId = 55, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 153, CategoryParentId = 58, CategoryName = "رایانه رومیزی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 154, CategoryParentId = 58, CategoryName = "رایانه همراه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 155, CategoryParentId = 58, CategoryName = "پرینتر، اسکنر، کپی و فکس", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 156, CategoryParentId = 58, CategoryName = "قطعات و لوازم جانبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 157, CategoryParentId = 58, CategoryName = "مودم و تجهیزات شبکه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 158, CategoryParentId = 58, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 159, CategoryParentId = 59, CategoryName = "فیلم و موسیقی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 160, CategoryParentId = 59, CategoryName = "دوربین عکاسی و فیلمبرداری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 161, CategoryParentId = 59, CategoryName = "پخش کننده همراه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 162, CategoryParentId = 59, CategoryName = "سیستم صوتی و خانگی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 163, CategoryParentId = 59, CategoryName = "DVD ویدئو و پخش کننده", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 164, CategoryParentId = 59, CategoryName = "تلوزیون و پروژکتور", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 165, CategoryParentId = 59, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 166, CategoryParentId = 60, CategoryName = "گوشی موبایل", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 167, CategoryParentId = 60, CategoryName = "تبلت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 168, CategoryParentId = 60, CategoryName = "لوازم جانبی و موبایل و تبلت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 169, CategoryParentId = 60, CategoryName = "سیم کارت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 170, CategoryParentId = 60, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 171, CategoryParentId = 64, CategoryName = "کنسرت", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 172, CategoryParentId = 64, CategoryName = "تئاتر و سینما", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 173, CategoryParentId = 64, CategoryName = "کارت هدیه و تخفیف", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 174, CategoryParentId = 64, CategoryName = "ورزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 175, CategoryParentId = 64, CategoryName = "اتوبوس، مترو و قطار", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 176, CategoryParentId = 64, CategoryName = "اماکن و مسابقات ورزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 177, CategoryParentId = 64, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 178, CategoryParentId = 65, CategoryName = "آموزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 179, CategoryParentId = 65, CategoryName = "تاریخی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 180, CategoryParentId = 65, CategoryName = "ادبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 181, CategoryParentId = 65, CategoryName = "مذهبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 182, CategoryParentId = 65, CategoryName = "مجلات", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 183, CategoryParentId = 65, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 184, CategoryParentId = 67, CategoryName = "گربه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 185, CategoryParentId = 67, CategoryName = "موش و خرگوش", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 186, CategoryParentId = 67, CategoryName = "خزنده", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 187, CategoryParentId = 67, CategoryName = "پرنده", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 188, CategoryParentId = 67, CategoryName = "ماهی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 189, CategoryParentId = 67, CategoryName = "لوازم جانبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 190, CategoryParentId = 67, CategoryName = "حیوانات مزرعه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 191, CategoryParentId = 67, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 192, CategoryParentId = 68, CategoryName = "سکه، تمبر و اسکناس", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 193, CategoryParentId = 68, CategoryName = "اشیای عتیقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 194, CategoryParentId = 68, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 195, CategoryParentId = 69, CategoryName = "گیتار، بیس و امپلیفایر", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 196, CategoryParentId = 69, CategoryName = "پیانو، کیبورد و آکاردئون", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 197, CategoryParentId = 69, CategoryName = "سنتی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 198, CategoryParentId = 69, CategoryName = "درام و پراکشن", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 199, CategoryParentId = 69, CategoryName = "سازهای بادی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 200, CategoryParentId = 69, CategoryName = "ویولن", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 201, CategoryParentId = 69, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 202, CategoryParentId = 70, CategoryName = "ورزش های توپی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 203, CategoryParentId = 70, CategoryName = "کوهنوردی و کمپینگ", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 204, CategoryParentId = 70, CategoryName = "غواصی و ورزش های آبی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 205, CategoryParentId = 70, CategoryName = "تجهیزات ورزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 206, CategoryParentId = 70, CategoryName = "ورزش های زمستانی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 207, CategoryParentId = 70, CategoryName = "اسب و تجهیزات اسب سواری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 208, CategoryParentId = 70, CategoryName = "ماهیگیری", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 209, CategoryParentId = 70, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 210, CategoryParentId = 74, CategoryName = "حراج", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 211, CategoryParentId = 74, CategoryName = "گردهمایی و همایش", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 212, CategoryParentId = 74, CategoryName = "موسیقی و تئاتر", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 213, CategoryParentId = 74, CategoryName = "ورزشی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 214, CategoryParentId = 74, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 215, CategoryParentId = 75, CategoryName = "خیریه و کمک رسانی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 216, CategoryParentId = 75, CategoryName = "تحقیقاتی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 217, CategoryParentId = 75, CategoryName = "متفرقه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 218, CategoryParentId = 77, CategoryName = "فروشگاه و مغازه", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 219, CategoryParentId = 77, CategoryName = "آرایشگاه و سالن های زیبایی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 220, CategoryParentId = 77, CategoryName = "دفتر کار", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 221, CategoryParentId = 77, CategoryName = "صنعتی", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 222, CategoryParentId = 77, CategoryName = "کافی شاپ و رستوران", CategoryNameEnglish = "" });
            allCategories.Add(new Category() { CategoryId = 223, CategoryParentId = 77, CategoryName = "متفرقه", CategoryNameEnglish = "" });

            foreach (Category category in allCategories)
            {
                category.Advertisements = null;
            }
        }
    }
}
