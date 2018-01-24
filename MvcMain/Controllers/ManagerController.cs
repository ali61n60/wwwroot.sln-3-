using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ModelStd;
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
        private readonly IImageRepository _imageRepository;
        private readonly AdDbContext _adDbContext;
        private readonly MessageApiController _messageApiController;
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
            List<Guid> allAdsInDataBase = _adDbContext.Advertisements.Select(advertisements => advertisements.AdId).ToList();
            Guid temp;
            try
            {
                foreach (string folder in AllFolders)
                {
                    if (Guid.TryParse(folder, out temp))
                    {
                        if (!allAdsInDataBase.Contains(Guid.Parse(folder)))
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
        [HttpGet]
        public async Task<IActionResult> TelegramMessage()
        {
            return View();
        }

        [Authorize(Roles = "Admins")]
        [HttpPost]
        public async Task<IActionResult> TelegramMessage(string meesage)
        {
            return View("TelegramMessage", "test");
        }


        [Authorize(Roles = "Admins")]
        [HttpGet]
        public async Task<IActionResult> CreateCategoryInFile()
        {
            return View(MyService.Inst.GetService<ICategoryRepository>().GetAllCategories().ToList());
        }


        [Authorize(Roles = "Admins")]
        public async Task<IActionResult> EmailAndSmsRegisterdLetMeKnowRecords()
        {
            //TODO Run This Method as an independent Never-Ending-TASK
            string errorCode = "ManagerController/EmailAndSmsRegisterdLetMeKnowRecords";
            List<LetMeKnow> letMeKnowList= _adDbContext.LetMeKnows.Include(know => know.User).ToList();
            List<ApprovedAd> approvedAdList = _adDbContext.ApprovedAds.Include(ad => ad.Ad).Where(ad => ad.ManagedByAdmin == false).ToList();
            try
            {
                foreach (ApprovedAd approvedAd in approvedAdList)
                {
                    foreach (LetMeKnow letMeKnow in letMeKnowList)
                    {
                        
                            if (approvedAdMatchsLetMeKnow(approvedAd, letMeKnow))
                            {
                                await putLetMeKnowEmailAndSms(approvedAd, letMeKnow);
                            }
                        
                    }
                    approvedAd.ManagedByAdmin = true;
                    await _adDbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                return View("ManageLetMeKnow", ex.Message+" ,"+errorCode);
            }
            
            return View("ManageLetMeKnow","Ok");
        }

        private bool approvedAdMatchsLetMeKnow(ApprovedAd approvedAd,LetMeKnow letMeKnow)
        {
            if (approvedAd.ApprovedDateTime < letMeKnow.RequestInsertDateTime)
            {
                return false;
            }
            if (approvedAd.Ad.CategoryId == letMeKnow.CategoryId)
            {
                
            }
            return false;
        }

        private async Task putLetMeKnowEmailAndSms(ApprovedAd approvedAd, LetMeKnow letMeKnow)
        {
            EmailMessageSingle emailMessageSingle = new EmailMessageSingle();
            SmsMessage smsMessage = new SmsMessage();
            switch (letMeKnow.EmailOrSms)
            {
                case EmailOrSms.Email:
                    emailMessageSingle.EmailAddress = letMeKnow.User.Email;
                    emailMessageSingle.Subject = "به من اطلاع بده";
                    emailMessageSingle.Title =
                        "یک آگهی جدید منطبق با درخواست شما به سایت ارسال شده است";
                    emailMessageSingle.TextMessage = "کاربر گرامی";
                    emailMessageSingle.TextMessage += "<br/><br/>";
                    emailMessageSingle.TextMessage += "با سلام و احترام";
                    emailMessageSingle.TextMessage += "<br/><br/>";
                    emailMessageSingle.TextMessage +=
                        "یک آگهی جدید منطبق با درخواست شما به سایت ارسال شده است";
                    emailMessageSingle.TextMessage += "<br/><br/>";
                    emailMessageSingle.TextMessage += "لینک آگهی";
                    emailMessageSingle.TextMessage += "<br/><br/>";
                    emailMessageSingle.TextMessage +=
                        $"<a href=\"http://whereismycar.ir/Home/AdDetail?adId={approvedAd.AdId}&categoryId={letMeKnow.CategoryId}\" target=\"_blank\">لینک آگهی</a>";
                    await _messageApiController.InsertEmailMessageInDataBase(emailMessageSingle,
                        letMeKnow.UserId);
                    break;
                case EmailOrSms.Sms:
                    //TODO fill sms
                    _messageApiController.InsertSmsMessageInDataBase(smsMessage);
                    break;
                case EmailOrSms.Both:
                    await _messageApiController.InsertEmailMessageInDataBase(emailMessageSingle,
                        letMeKnow.UserId);
                    _messageApiController.InsertSmsMessageInDataBase(smsMessage);

                    break;
            }
        }
    }
}
