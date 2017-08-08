using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;



namespace ServiceLayer 
{ 
    public class Parser
    {
        public static int ParseInt(string intString, int defaultValue)
        {
            int tempInt;
            try
            {
                tempInt = int.Parse(intString);
            }
            catch (Exception)
            {
                tempInt = defaultValue;
            }
            return tempInt;
        }
    }
}