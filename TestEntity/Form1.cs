using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
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
            //        var fullEntries = dbContext.tbl_EntryPoint
            //.Join(
            //    dbContext.tbl_Entry,
            //    entryPoint => entryPoint.EID,
            //    entry => entry.EID,
            //    (entryPoint, entry) => new { entryPoint, entry }
            //)


            var list = _chikojaDbContext.Advertisements.Where(advertisement => advertisement.categoryId == 100)
                .Include(advertisement => advertisement.Category).Include(advertisement => advertisement.District);
            //.Join(_chikojaDbContext.Districts.Include(district => district.City),
            //  advertisement => advertisement.districtId,district => district.districtId,(advertisement, district) => advertisement.districtId==district.districtId);
            foreach (var b in list)
            {

            }

            //foreach (var b in list)
            //{

            //}
            //{
            //    result =$"adId={advertisement.adId}, adTitle={advertisement.adTitle},adCategoryName={advertisement.Category.categoryName},"+
            //        $" AdDistrict={advertisement.District.districtName}, AdCity={advertisement.District.City.cityName}";

            //    listBox1.Items.Add(result);
            //}
        }
    }
}
