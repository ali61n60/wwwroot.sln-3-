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
           IIncludableQueryable<Brand, ICollection<CarModel>> list=  _chikojaDbContext.Brands.Include(brand => brand.CarModels);
            var carList = _chikojaDbContext.CarModels.Where(model => model.Brand.brandId == 1);
            foreach (Brand brand in list.ToList())
            {
                ICollection<CarModel> carLists = brand.CarModels;
                result= $"brandId={brand.brandId}, brandName={brand.brandName}";
                listBox1.Items.Add(result);
                foreach (CarModel carModel in carLists)
                {
                    result = $"ModelId={carModel.modelId}, ModelName={carModel.modelName}, BrandName={carModel.Brand.brandName}";
                    listBox1.Items.Add(result);
                }
            }
        }
    }
}
