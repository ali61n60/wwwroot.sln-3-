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
            IEnumerable<string> AllFolders =await _imageRepository.GetAllAdIdsFolderName();
            List<Guid> AllAdsInDataBase = _adDbContext.Advertisements.Select(advertisements => advertisements.AdId).ToList();
            Guid temp;
            try
            {
                foreach (string folder in AllFolders)
                {
                    if (Guid.TryParse(folder, out temp))
                    {
                        if (!AllAdsInDataBase.Contains(Guid.Parse(folder)))
                        {
                            _imageRepository.MoveFolderToImagesWithoutAdDirectory(folder);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return View("ManageAdImageFolder", ex.Message);
            }
            
            return View("ManageAdImageFolder","Folders Removed at "+DateTime.Now);
        }

    }
}
