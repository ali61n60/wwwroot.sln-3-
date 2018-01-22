using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelStd;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using NuGet.Configuration;
using NuGet.Protocol.Core.v3;
using RepositoryStd.Context.AD;
using Telegram.Bot;
using Telegram.Bot.Types;

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
            List<LetMeKnow> letMeKnowList= _adDbContext.LetMeKnows.Include(know => know.User).ToList();
            List<ApprovedAd> approvedAdList = _adDbContext.ApprovedAds.Include(ad => ad.Ad).Where(ad => ad.ManagedByAdmin == false).ToList();

            foreach (ApprovedAd approvedAd in approvedAdList)
            {
                foreach (LetMeKnow letMeKnow in letMeKnowList)
                {
                    if (approvedAd.ApprovedDateTime > letMeKnow.RequestInsertDateTime)
                    {
                        if (approvedAd.Ad.CategoryId == letMeKnow.CategoryId)
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
                approvedAd.ManagedByAdmin = true;
               await _adDbContext.SaveChangesAsync();
            }


            return View("ManageLetMeKnow","ToBeDone");
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
            TelegramBotClient botClient=new TelegramBotClient("513492179:AAFzCqA5jZArPoRhqMt_7M3hRVDDbsgyshI");
            //botClient.SendTextMessageAsync(new ChatId(), )
            ChatId chatId = new ChatId("@WhereIsMyCarChannel");
            await botClient.SendTextMessageAsync(chatId, "Hello from AliBot");

            return View();
        }



    }
}
