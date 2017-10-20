﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using MvcMain.Infrastructure.Services;
using MvcMain.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//http://bitoftech.net/2014/06/01/token-based-authentication-asp-net-web-api-2-owin-asp-net-identity/

namespace MvcMain.Controllers
{
    public class HomeController : Controller
    {
        //[Authorize]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> AdDetail(AdDetailInfo adDetailInfo)
        {
            AdApiController adApiController=new AdApiController();
            //TODO based on adCategory  get ad detail from database and show specific view
            //1- get a view based on categoryId
            switch (adDetailInfo.CategoryId)
            {
                case 100:
                    //TODOD get model data from repository and send it to view

                    AdvertisementTransportation advertisementTransportation = adApiController.GetTransportationAdDetail(adDetailInfo.AdId);

                    return View("AdDetail/AdDetailTransportation", advertisementTransportation);
                default:
                    return View("AdDetail/AdDetailDefault", adDetailInfo);
            }
        }
    }
}
