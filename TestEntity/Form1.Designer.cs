namespace TestEntity
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.buttonGetPrice = new System.Windows.Forms.Button();
            this.listBox1 = new System.Windows.Forms.ListBox();
            this.buttonGetCars = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // buttonGetPrice
            // 
            this.buttonGetPrice.Location = new System.Drawing.Point(76, 13);
            this.buttonGetPrice.Name = "buttonGetPrice";
            this.buttonGetPrice.Size = new System.Drawing.Size(75, 23);
            this.buttonGetPrice.TabIndex = 0;
            this.buttonGetPrice.Text = "Get Price";
            this.buttonGetPrice.UseVisualStyleBackColor = true;
            this.buttonGetPrice.Click += new System.EventHandler(this.button1_Click);
            // 
            // listBox1
            // 
            this.listBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.listBox1.FormattingEnabled = true;
            this.listBox1.Location = new System.Drawing.Point(28, 64);
            this.listBox1.Name = "listBox1";
            this.listBox1.Size = new System.Drawing.Size(232, 186);
            this.listBox1.TabIndex = 1;
            // 
            // buttonGetCars
            // 
            this.buttonGetCars.Location = new System.Drawing.Point(157, 12);
            this.buttonGetCars.Name = "buttonGetCars";
            this.buttonGetCars.Size = new System.Drawing.Size(75, 23);
            this.buttonGetCars.TabIndex = 2;
            this.buttonGetCars.Text = "Get Cars";
            this.buttonGetCars.UseVisualStyleBackColor = true;
            this.buttonGetCars.Click += new System.EventHandler(this.buttonGetCars_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 262);
            this.Controls.Add(this.buttonGetCars);
            this.Controls.Add(this.listBox1);
            this.Controls.Add(this.buttonGetPrice);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button buttonGetPrice;
        private System.Windows.Forms.ListBox listBox1;
        private System.Windows.Forms.Button buttonGetCars;
    }
}

