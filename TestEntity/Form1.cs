﻿using System;
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
        private ChikojaDbContext _chikojaDbContext;
        public Form1()
        {
            InitializeComponent();
            TemporaryDbContextFactory temporaryDbContextFactory = new TemporaryDbContextFactory();
            _chikojaDbContext = temporaryDbContextFactory.Create(null);
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                IQueryable<Price> allPrices = _chikojaDbContext.Prices.Where(p => p.price1 > 0);
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
            IIncludableQueryable<Brand, ICollection<CarModel>> list = _chikojaDbContext.Brands.Include(brand => brand.CarModels);
            var carList = _chikojaDbContext.CarModels.Where(model => model.Brand.brandId == 1).Include(model => model.Brand);
            foreach (CarModel carModel in carList)
            {
                result = $"CarModel={carModel.modelName}, BrandName={carModel.Brand.brandName}";
                listBox1.Items.Add(result);
            }

        }

        private void buttonGetAdvertisement_Click(object sender, EventArgs e)
        {
            string result = "";
            var districtList = _chikojaDbContext.Districts.Include(district => district.City)
                .Join(_chikojaDbContext.Provinces,
                    district => district.City.provinceId,
                    province => province.provinceId,
                    (district, province) => new FullProvince(district, district.City, province));



            var list = _chikojaDbContext.Advertisements.Where(advertisement => advertisement.categoryId == 100)
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
