using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ModelStd.Advertisements;
using ModelStd.DB;
using RepositoryStd.DB;
using City = ModelStd.Advertisements.Location.City;
using District = ModelStd.Advertisements.Location.District;
using Province = ModelStd.Advertisements.Location.Province;

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
                IQueryable<Price> allPrices = _adCommonDbContext.Prices.Where(p => p.price > 0);
                foreach (Price currentPrice in allPrices)
                {
                    listBox1.Items.Add((currentPrice.price + " ," + currentPrice.priceType));
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
        }
    }
   
}
