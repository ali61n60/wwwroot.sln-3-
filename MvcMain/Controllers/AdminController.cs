﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Controllers
{
    //TODO manage submitted ads
    //TODO manage Ad image folder
    public class AdminController:Controller
    {
        public async Task<IActionResult> Index()
        {
            return View();
        }
    }
}