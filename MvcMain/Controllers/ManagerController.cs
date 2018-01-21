using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelStd.Db.Ad;
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
        private MessageApiController _messageApiController;
        public ManagerController(IImageRepository imageRepository,AdDbContext adDbContext, MessageApiController messageApiController)
        {
            _imageRepository = imageRepository;
            _adDbContext = adDbContext;
            _messageApiController = messageApiController;
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
            //TODO create a mechanisem for ads with priority in Admin View
            //TODO create a view component for Admin Ad.
            //Get ad status from user and send it to repository to get ads
            //modify, accept or reject ad
            //inform ad owner about his ad new status

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

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> ManageLetMeKnow()
        {
            return View("ManageLetMeKnow","");
        }

        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> EmailAndSmsRegisterdLetMeKnowRecords()
        {
            //TODO get requested let me know
            //Get ApprovedAds with managed by admin false
            //foreach approved ad check each requsted let me know and if thay macth based on email/sms/bot  call messageApi to add a record in sms/email
            List<LetMeKnow> letMeKnowList= _adDbContext.LetMeKnows.ToList();
            List<ApprovedAd> approvedAdList = _adDbContext.ApprovedAds
                .Include(ad => ad.Ad)
                .Where(ad => ad.ManagedByAdmin == false).ToList();

            foreach (ApprovedAd approvedAd in approvedAdList)
            {
                foreach (LetMeKnow letMeKnow in letMeKnowList)
                {
                    if (approvedAd.Ad.CategoryId == letMeKnow.CategoryId)
                    {
                        switch (letMeKnow.EmailOrSms)
                        {
                            case EmailOrSms.Email:
                                //_messageApiController.InsertEmailMessageInDataBase()
                                //add email
                                break;
                            case EmailOrSms.Sms:
                                //_messageApiController.InsertSmsMessageInDataBase()
                                //add sms
                                break;
                            case EmailOrSms.Both:
                                //_messageApiController.InsertEmailMessageInDataBase()
                                //_messageApiController.InsertSmsMessageInDataBase()
                                //add email and sms
                                break;
                        }
                            
                    }
                }
            }


            return View("ManageLetMeKnow","ToBeDone");
        }

    }
}
