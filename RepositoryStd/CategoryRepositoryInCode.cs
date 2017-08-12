using System.Collections.Generic;
using ModelStd.Advertisements;
using ModelStd.IRepository;

namespace RepositoryStd
{
    public class CategoryRepositoryInCode : ICategoryRepository
    {
        private List<Category> allCategories;
        public int CategoryVersion { get { return 1; } }

        
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

        public Category[] GetAllCategories()
        {
            return allCategories.ToArray();
        }

        public Category[] GetAllChildernCategories(int ParentCategoryId)
        {
            List<Category> tempList=new List<Category>();
            foreach (Category category in allCategories)
            {
                if (category.ParentCategoryId == ParentCategoryId)
                {
                    tempList.Add(category);
                }
            }
            return tempList.ToArray();
        }

        public Category FindCategoryByEnglishName(string EnglishCategoryName)
        {
            Category tempCategory = null;
            foreach (Category category in allCategories)
            {
                if (category.EnglishCategoryName == EnglishCategoryName)
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
                    tempCategory = this.FindCategoryById(category.ParentCategoryId);
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
                if (temCategory.ParentCategoryId == 0)
                {
                    rootParentCategory = temCategory;
                    break;
                }
                else
                {
                    temCategory = findCategoryById(temCategory.ParentCategoryId);
                }
            }

            return rootParentCategory;
        }

        private Category findCategoryById(int categoryId)
        {
            Category tempCategory=null;
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


        

        /// <summary>
        /// 
        /// </summary>
        private void fillAllCategories()
        {
            allCategories = new List<Category>();
            allCategories.Add(new Category(1, 0, "املاک", "Estate"));
            allCategories.Add(new Category(2, 0, "وسایل نقلیه", "TransportationRepository"));
            allCategories.Add(new Category(3, 0, "استخدام و کاریابی", "Recruitment"));
            allCategories.Add(new Category(4, 0, "مربوط به خانه", "Housing"));
            allCategories.Add(new Category(5, 0, "خدمات", "Services"));
            allCategories.Add(new Category(6, 0, "وسایل شخصی", "PersonalStuff"));
            allCategories.Add(new Category(7, 0, "لوازم الکترونیکی", "Electronics"));
            allCategories.Add(new Category(8, 0, "سرگرمی و فراغت", "Entertainment"));
            allCategories.Add(new Category(9, 0, "اجتماعی", "Social"));
            allCategories.Add(new Category(10, 0, "برای کسب و کار", "Business"));
            allCategories.Add(new Category(11, 1, "خدمات املاک", ""));
            allCategories.Add(new Category(12, 1, "فروش مسکونی", ""));
            allCategories.Add(new Category(13, 1, "اجاره مسکونی", ""));
            allCategories.Add(new Category(14, 1, "فروش اداری و تجاری", ""));
            allCategories.Add(new Category(15, 1, "اجاره اداری و تجاری", ""));
            allCategories.Add(new Category(16, 1, "متفرقه", ""));
            allCategories.Add(new Category(17, 2, "خودرو", ""));
            allCategories.Add(new Category(18, 2, "قطعات یدکی و لوازم جانبی خودرو", ""));
            allCategories.Add(new Category(19, 2, "قایق و لوازم جانبی", ""));
            allCategories.Add(new Category(20, 2, "موتور سیکلت و لوازم جانبی", ""));
            allCategories.Add(new Category(21, 2, "متفرقه", ""));
            allCategories.Add(new Category(22, 3, "اداری و مدیریت", ""));
            allCategories.Add(new Category(23, 3, "معماری و ساختمانی", ""));
            allCategories.Add(new Category(24, 3, "رایانه و فناوری اطلاعات", ""));
            allCategories.Add(new Category(25, 3, "مالی و حسابداری و حقوقی", ""));
            allCategories.Add(new Category(26, 3, "بازاریابی و فروش", ""));
            allCategories.Add(new Category(27, 3, "صنعتی و فنی و مهندسی", ""));
            allCategories.Add(new Category(28, 3, "آموزشی", ""));
            allCategories.Add(new Category(29, 3, "حمل و نقل", ""));
            allCategories.Add(new Category(30, 3, "درمانی و زیبایی و بهداشتی", ""));
            allCategories.Add(new Category(31, 3, "هنری و رسانه", ""));
            allCategories.Add(new Category(32, 3, "خدمات فروشگاه و رستوران", ""));
            allCategories.Add(new Category(33, 3, "سرایداری و نظافت", ""));
            allCategories.Add(new Category(34, 3, "متفرقه", ""));
            allCategories.Add(new Category(35, 4, "ساختمان و حیاط", ""));
            allCategories.Add(new Category(36, 4, "وسایل و تزیینات خانه", ""));
            allCategories.Add(new Category(37, 4, "وسایل آشپزخانه", ""));
            allCategories.Add(new Category(38, 4, "ابزار", ""));
            allCategories.Add(new Category(39, 4, "متفرقه", ""));
            allCategories.Add(new Category(40, 5, "موتور و ماشین", ""));
            allCategories.Add(new Category(41, 5, "پذیرایی و مراسم", ""));
            allCategories.Add(new Category(42, 5, "خدمات رایانه و موبایل", ""));
            allCategories.Add(new Category(43, 5, "مالی، حسابداری و بیمه", ""));
            allCategories.Add(new Category(44, 5, "حمل و نقل", ""));
            allCategories.Add(new Category(45, 5, "پیشه و مهارت", ""));
            allCategories.Add(new Category(46, 5, "آرایشگری و زیبایی", ""));
            allCategories.Add(new Category(47, 5, "سرگرمی", ""));
            allCategories.Add(new Category(48, 5, "نظافت", ""));
            allCategories.Add(new Category(49, 5, "باغبانی و درختکاری", ""));
            allCategories.Add(new Category(50, 5, "آموزشی", ""));
            allCategories.Add(new Category(51, 5, "متفرقه", ""));
            allCategories.Add(new Category(52, 6, "کیف، کفش و لباس", ""));
            allCategories.Add(new Category(53, 6, "تزیینی", ""));
            allCategories.Add(new Category(54, 6, "کفش و لباس بچه", ""));
            allCategories.Add(new Category(55, 6, "وسایل بچه و اسباب بازی", ""));
            allCategories.Add(new Category(56, 6, "آرایشی، بهداشتی و درمانی", ""));
            allCategories.Add(new Category(57, 6, "متفرقه", ""));
            allCategories.Add(new Category(58, 7, "رایانه", ""));
            allCategories.Add(new Category(59, 7, "صوتی و تصویری", ""));
            allCategories.Add(new Category(60, 7, "موبایل و تبلت", ""));
            allCategories.Add(new Category(61, 7, "کنسول بازی ویدئویی و آنلاین", ""));
            allCategories.Add(new Category(62, 7, "دستگاه تلفن", ""));
            allCategories.Add(new Category(63, 7, "متفرقه", ""));
            allCategories.Add(new Category(64, 8, "بلیط", ""));
            allCategories.Add(new Category(65, 8, "کتاب و مجله", ""));
            allCategories.Add(new Category(66, 8, "دوچرخه، اسکیت و اسکوتر", ""));
            allCategories.Add(new Category(67, 8, "حیوانات", ""));
            allCategories.Add(new Category(68, 8, "کلکسیون و سرگرمی", ""));
            allCategories.Add(new Category(69, 8, "آلات موسیقی", ""));
            allCategories.Add(new Category(70, 8, "ورزش و تناسب اندام", ""));
            allCategories.Add(new Category(71, 8, "اسباب بازی", ""));
            allCategories.Add(new Category(72, 8, "تور و چارتر", ""));
            allCategories.Add(new Category(73, 8, "متفرقه", ""));
            allCategories.Add(new Category(74, 9, "رویداد", ""));
            allCategories.Add(new Category(75, 9, "داوطلبانه", ""));
            allCategories.Add(new Category(76, 9, "متفرقه", ""));
            allCategories.Add(new Category(77, 10, "تجهیزات و ماشین آلات", ""));
            allCategories.Add(new Category(78, 10, "عمده فروشی", ""));
            allCategories.Add(new Category(79, 10, "متفرقه", ""));
            allCategories.Add(new Category(80, 11, "آژانس املاک", ""));
            allCategories.Add(new Category(81, 11, "مشارکت در ساخت", ""));
            allCategories.Add(new Category(82, 11, "امور مالی و حقوقی", ""));
            allCategories.Add(new Category(83, 11, "پیش فروش", ""));
            allCategories.Add(new Category(84, 11, "متفرقه", ""));
            allCategories.Add(new Category(85, 12, "آپارتمان", ""));
            allCategories.Add(new Category(86, 12, "خانه و ویلایی", ""));
            allCategories.Add(new Category(87, 12, "زمین و کلنگی", ""));
            allCategories.Add(new Category(88, 12, "متفرقه", ""));
            allCategories.Add(new Category(89, 13, "آپارتمان", ""));
            allCategories.Add(new Category(90, 13, "خانه و ویلا", ""));
            allCategories.Add(new Category(91, 13, "متفرقه", ""));
            allCategories.Add(new Category(92, 14, "دفتر کار، اتاق اداری و مطب", ""));
            allCategories.Add(new Category(93, 14, "مغازه و غرفه", ""));
            allCategories.Add(new Category(94, 14, "صنعتی، کشاورزی و تجاری", ""));
            allCategories.Add(new Category(95, 14, "متفرقه", ""));
            allCategories.Add(new Category(96, 15, "دفتر کار، اتاق اداری و مطب", ""));
            allCategories.Add(new Category(97, 15, "مغازه و غرفه", ""));
            allCategories.Add(new Category(98, 15, "صنعتی، کشاورزی و تجاری", ""));
            allCategories.Add(new Category(99, 15, "متفرقه", ""));
            allCategories.Add(new Category(100, 17, "سواری", ""));
            allCategories.Add(new Category(101, 17, "سنگین", ""));
            allCategories.Add(new Category(102, 17, "متفرقه", ""));
            allCategories.Add(new Category(103, 35, "سرویس بهداشتی و سونا", ""));
            allCategories.Add(new Category(104, 35, "سیستم گرمایشیو سرمایشی و گاز", ""));
            allCategories.Add(new Category(105, 35, "آشپزخانه", ""));
            allCategories.Add(new Category(106, 35, "حیاط و ایوان", ""));
            allCategories.Add(new Category(107, 35, "ابزار باغبانی", ""));
            allCategories.Add(new Category(108, 35, "متفرقه", ""));
            allCategories.Add(new Category(109, 36, "تزیینی و آثار هنری", ""));
            allCategories.Add(new Category(110, 36, "لوازم روشنایی", ""));
            allCategories.Add(new Category(111, 36, "میز و صندلی", ""));
            allCategories.Add(new Category(112, 36, "فرش و گلیم", ""));
            allCategories.Add(new Category(113, 36, "کمد و بوفه", ""));
            allCategories.Add(new Category(114, 36, "پرده و رومیزی", ""));
            allCategories.Add(new Category(115, 36, "تخت و اتاق خواب", ""));
            allCategories.Add(new Category(116, 36, "مبلمان و صندلی راحتی", ""));
            allCategories.Add(new Category(117, 36, "میز تلوزیون و وسایل سیستم پخش", ""));
            allCategories.Add(new Category(118, 36, "متفرقه", ""));
            allCategories.Add(new Category(119, 37, "ماشین ظرفشویی", ""));
            allCategories.Add(new Category(120, 37, "یخچال و فریزر", ""));
            allCategories.Add(new Category(121, 37, "وسایل آشپزی و غذا خوری", ""));
            allCategories.Add(new Category(122, 37, "مایکروویو و گاز", ""));
            allCategories.Add(new Category(123, 37, "ماشین لباسشویی و خشک کننده", ""));
            allCategories.Add(new Category(124, 37, "متفرقه", ""));
            allCategories.Add(new Category(125, 38, "نظافت و خیاطی و اتو", ""));
            allCategories.Add(new Category(126, 38, "تعمیرات", ""));
            allCategories.Add(new Category(127, 38, "متفرقه", ""));
            allCategories.Add(new Category(128, 42, "فروش دامنه و سایت", ""));
            allCategories.Add(new Category(129, 42, "میزبانی و طراحی سایت", ""));
            allCategories.Add(new Category(130, 42, "خدمات پهنای باند اینترنت", ""));
            allCategories.Add(new Category(131, 42, "خدمات نزم افزار و سخت افزار کامپیوتر", ""));
            allCategories.Add(new Category(132, 42, "تعمیرات نرم افزار و سخت افزار گوشی موبایل", ""));
            allCategories.Add(new Category(133, 42, "متفرقه", ""));
            allCategories.Add(new Category(134, 50, "زبان خارجی", ""));
            allCategories.Add(new Category(135, 50, "دروس مدرسه و دانشگاه", ""));
            allCategories.Add(new Category(136, 50, "نرم افزار", ""));
            allCategories.Add(new Category(137, 50, "هنری", ""));
            allCategories.Add(new Category(138, 50, "ورزشی", ""));
            allCategories.Add(new Category(139, 50, "مشاوره تحصیلی", ""));
            allCategories.Add(new Category(140, 50, "متفرقه", ""));
            allCategories.Add(new Category(141, 52, "کیف، کفش و کمربند", ""));
            allCategories.Add(new Category(142, 52, "لباس", ""));
            allCategories.Add(new Category(143, 52, "متفرقه", ""));
            allCategories.Add(new Category(144, 53, "ساعت", ""));
            allCategories.Add(new Category(145, 53, "جواهرات", ""));
            allCategories.Add(new Category(146, 53, "بدلیجات", ""));
            allCategories.Add(new Category(147, 53, "متفرقه", ""));
            allCategories.Add(new Category(148, 55, "اسباب بازی", ""));
            allCategories.Add(new Category(149, 55, "کالسکه و لوازم جانبی", ""));
            allCategories.Add(new Category(150, 55, "صندلی بچه", ""));
            allCategories.Add(new Category(151, 55, "اسباب و اثاث بچه", ""));
            allCategories.Add(new Category(152, 55, "متفرقه", ""));
            allCategories.Add(new Category(153, 58, "رایانه رومیزی", ""));
            allCategories.Add(new Category(154, 58, "رایانه همراه", ""));
            allCategories.Add(new Category(155, 58, "پرینتر، اسکنر، کپی و فکس", ""));
            allCategories.Add(new Category(156, 58, "قطعات و لوازم جانبی", ""));
            allCategories.Add(new Category(157, 58, "مودم و تجهیزات شبکه", ""));
            allCategories.Add(new Category(158, 58, "متفرقه", ""));
            allCategories.Add(new Category(159, 59, "فیلم و موسیقی", ""));
            allCategories.Add(new Category(160, 59, "دوربین عکاسی و فیلمبرداری", ""));
            allCategories.Add(new Category(161, 59, "پخش کننده همراه", ""));
            allCategories.Add(new Category(162, 59, "سیستم صوتی و خانگی", ""));
            allCategories.Add(new Category(163, 59, "DVD ویدئو و پخش کننده", ""));
            allCategories.Add(new Category(164, 59, "تلوزیون و پروژکتور", ""));
            allCategories.Add(new Category(165, 59, "متفرقه", ""));
            allCategories.Add(new Category(166, 60, "گوشی موبایل", ""));
            allCategories.Add(new Category(167, 60, "تبلت", ""));
            allCategories.Add(new Category(168, 60, "لوازم جانبی و موبایل و تبلت", ""));
            allCategories.Add(new Category(169, 60, "سیم کارت", ""));
            allCategories.Add(new Category(170, 60, "متفرقه", ""));
            allCategories.Add(new Category(171, 64, "کنسرت", ""));
            allCategories.Add(new Category(172, 64, "تئاتر و سینما", ""));
            allCategories.Add(new Category(173, 64, "کارت هدیه و تخفیف", ""));
            allCategories.Add(new Category(174, 64, "ورزشی", ""));
            allCategories.Add(new Category(175, 64, "اتوبوس، مترو و قطار", ""));
            allCategories.Add(new Category(176, 64, "اماکن و مسابقات ورزشی", ""));
            allCategories.Add(new Category(177, 64, "متفرقه", ""));
            allCategories.Add(new Category(178, 65, "آموزشی", ""));
            allCategories.Add(new Category(179, 65, "تاریخی", ""));
            allCategories.Add(new Category(180, 65, "ادبی", ""));
            allCategories.Add(new Category(181, 65, "مذهبی", ""));
            allCategories.Add(new Category(182, 65, "مجلات", ""));
            allCategories.Add(new Category(183, 65, "متفرقه", ""));
            allCategories.Add(new Category(184, 67, "گربه", ""));
            allCategories.Add(new Category(185, 67, "موش و خرگوش", ""));
            allCategories.Add(new Category(186, 67, "خزنده", ""));
            allCategories.Add(new Category(187, 67, "پرنده", ""));
            allCategories.Add(new Category(188, 67, "ماهی", ""));
            allCategories.Add(new Category(189, 67, "لوازم جانبی", ""));
            allCategories.Add(new Category(190, 67, "حیوانات مزرعه", ""));
            allCategories.Add(new Category(191, 67, "متفرقه", ""));
            allCategories.Add(new Category(192, 68, "سکه، تمبر و اسکناس", ""));
            allCategories.Add(new Category(193, 68, "اشیای عتیقه", ""));
            allCategories.Add(new Category(194, 68, "متفرقه", ""));
            allCategories.Add(new Category(195, 69, "گیتار، بیس و امپلیفایر", ""));
            allCategories.Add(new Category(196, 69, "پیانو، کیبورد و آکاردئون", ""));
            allCategories.Add(new Category(197, 69, "سنتی", ""));
            allCategories.Add(new Category(198, 69, "درام و پراکشن", ""));
            allCategories.Add(new Category(199, 69, "سازهای بادی", ""));
            allCategories.Add(new Category(200, 69, "ویولن", ""));
            allCategories.Add(new Category(201, 69, "متفرقه", ""));
            allCategories.Add(new Category(202, 70, "ورزش های توپی", ""));
            allCategories.Add(new Category(203, 70, "کوهنوردی و کمپینگ", ""));
            allCategories.Add(new Category(204, 70, "غواصی و ورزش های آبی", ""));
            allCategories.Add(new Category(205, 70, "تجهیزات ورزشی", ""));
            allCategories.Add(new Category(206, 70, "ورزش های زمستانی", ""));
            allCategories.Add(new Category(207, 70, "اسب و تجهیزات اسب سواری", ""));
            allCategories.Add(new Category(208, 70, "ماهیگیری", ""));
            allCategories.Add(new Category(209, 70, "متفرقه", ""));
            allCategories.Add(new Category(210, 74, "حراج", ""));
            allCategories.Add(new Category(211, 74, "گردهمایی و همایش", ""));
            allCategories.Add(new Category(212, 74, "موسیقی و تئاتر", ""));
            allCategories.Add(new Category(213, 74, "ورزشی", ""));
            allCategories.Add(new Category(214, 74, "متفرقه", ""));
            allCategories.Add(new Category(215, 75, "خیریه و کمک رسانی", ""));
            allCategories.Add(new Category(216, 75, "تحقیقاتی", ""));
            allCategories.Add(new Category(217, 75, "متفرقه", ""));
            allCategories.Add(new Category(218, 77, "فروشگاه و مغازه", ""));
            allCategories.Add(new Category(219, 77, "آرایشگاه و سالن های زیبایی", ""));
            allCategories.Add(new Category(220, 77, "دفتر کار", ""));
            allCategories.Add(new Category(221, 77, "صنعتی", ""));
            allCategories.Add(new Category(222, 77, "کافی شاپ و رستوران", ""));
            allCategories.Add(new Category(223, 77, "متفرقه", ""));
        }
    }
}
