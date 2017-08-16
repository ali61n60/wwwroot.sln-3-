using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using RepositoryStd.DB;

namespace TestEntity
{
    public partial class Form1 : Form
    {
        
        private AdCommonDbContext _adCommonDbContext;
        public Form1()
        {
            InitializeComponent();
            DbContextFactory dbContextFactory =
                new DbContextFactory(
                    "Data Source= .\\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801;MultipleActiveResultSets=true");
            _adCommonDbContext = dbContextFactory.Create<AdCommonDbContext>();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                IQueryable<Price> allPrices = _adCommonDbContext.Prices.Where(p => p.price1 > 0);
                foreach (Price currentPrice in allPrices)
                {
                    listBox1.Items.Add((currentPrice.price1 + " ," + currentPrice.priceType));
                }
            }
            catch (Exception ex)
            {
                listBox1.Items.Add(ex.Message);
            }


        }

        private void buttonGetCars_Click(object sender, EventArgs e)
        {
            string result = "";
            IIncludableQueryable<Brand, ICollection<CarModel>> list = _adCommonDbContext.Brands.Include(brand => brand.CarModels);
            var carList = _adCommonDbContext.CarModels.Where(model => model.Brand.brandId == 1).Include(model => model.Brand);
            foreach (CarModel carModel in carList)
            {
                result = $"CarModel={carModel.modelName}, BrandName={carModel.Brand.brandName}";
                listBox1.Items.Add(result);
            }

        }

        private void buttonGetAdvertisement_Click(object sender, EventArgs e)
        {
            string result = "";
            var districtList = _adCommonDbContext.Districts.Include(district => district.City)
                .Join(_adCommonDbContext.Provinces,
                    district => district.City.provinceId,
                    province => province.provinceId,
                    (district, province) => new FullProvince(district, district.City, province));



            var list = _adCommonDbContext.Advertisements.Where(advertisement => advertisement.categoryId == 100)
                .Include(advertisement => advertisement.Category).Include(advertisement => advertisement.District)
                .Join(districtList,
                    advertisement => advertisement.districtId,
                    fullProvince => fullProvince.FDistrict.districtId,
                    (advertisement, province) => new {advertisement, province});
            foreach (var j in list)
            {
                result =$"adId={j.advertisement.adId}," +
                        $" adTitle={j.advertisement.adTitle}," +
                        $"adCategoryName={j.advertisement.Category.categoryName},"+
                        $" AdDistrict={j.advertisement.District.districtName}," +
                        $" AdCity={j.advertisement.District.City.cityName}," +
                        $"AdProvince={j.province.FProvince.provinceName}";

                listBox1.Items.Add(result);
            }
        }
    }

    public class FullProvince
    {
        public FullProvince(District district, City city, Province province)
        {
            FDistrict = district;
            FCity = city;
            FProvince = province;
        }
        public District FDistrict { get; set; }
        public City FCity { get; set; }
        public Province FProvince { get; set; }

    }
}
