﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MvcMain.Controllers
{
    public class UserController:Controller
    {
        public async Task<IActionResult> Index()
        {
            return View();
        }
    }
}