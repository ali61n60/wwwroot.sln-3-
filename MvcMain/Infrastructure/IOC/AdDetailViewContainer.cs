using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Infrastructure.IOC
{
    public class AdDetailViewContainer
    {
        private static Dictionary<int, string> _viewContaner=new Dictionary<int, string>();
        private static int defaultCategoryId = 0;
        static AdDetailViewContainer()
        {
            RegisterViews();
        }

        private static void RegisterViews()
        {
            _viewContaner[100] = "AdDetail/AdDetailTransportation";
            _viewContaner[defaultCategoryId] = "AdDetail/AdDetailDefault";
        }

        public static string GetViewName(int categoryId)
        {
            if (_viewContaner.ContainsKey(categoryId))
            {
                return _viewContaner[categoryId];
            }
            return _viewContaner[defaultCategoryId];
        }
    }
}
