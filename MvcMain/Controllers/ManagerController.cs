using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelStd.IRepository;
using RepositoryStd.Context.AD;

namespace MvcMain.Controllers
{
    
    //TODO manage submitted ads, inform users registerd in LetMeKnow page
    //TODO
    //TODO manage Ad image folder
    public class ManagerController:Controller
    {
        private IImageRepository _imageRepository;
        private AdDbContext _adDbContext;
        public ManagerController(IImageRepository imageRepository,AdDbContext adDbContext)
        {
            _imageRepository = imageRepository;
            _adDbContext = adDbContext;
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> ManageSubmittedAds()
        {
            return View();
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> ManageAdImageFolder()
        {
            return View("ManageAdImageFolder","");
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> RemoveFoldersWithNoDatabaseRecords()
        {
            //TODO implement RemoveFoldersWithNoDatabaseRecords
            //Get All Folders from image repository
            //Get All AdId from database
            //foreach folder if there is on adId keep it elese remove it
            IEnumerable<string> AllFolders =await _imageRepository.GetAllAdIdsFolderName();
            List<Guid> AllAdsInDataBase = _adDbContext.Advertisements.Select(advertisements => advertisements.AdId).ToList();
            List<string> FoldersWithAd=new List<string>();
            List<string> FoldersWithoutAd = new List<string>();
            foreach (string folder in AllFolders)
            {
                if (AllAdsInDataBase.Contains(Guid.Parse(folder)))
                {
                    FoldersWithAd.Add(folder);
                }
                else
                {
                    //TODO first move FoldersWithoutAd to anoder location 
                    FoldersWithoutAd.Add(folder);
                    _imageRepository.MoveFolderToImagesWithoutAdDirectory(folder);
                }
            }
            return View("ManageAdImageFolder","Folders Removed");
        }

    }
}
