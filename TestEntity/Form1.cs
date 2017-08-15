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
using RepositoryStd.DB;

namespace TestEntity
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                TemporaryDbContextFactory temporaryDbContextFactory = new TemporaryDbContextFactory();
                ChikojaDbContext dbContext = temporaryDbContextFactory.Create(null);
                IQueryable<Price> allPrices = dbContext.Prices.Where(p => p.price1 > 0);
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
    }
}
