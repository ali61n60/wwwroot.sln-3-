using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements;
using ModelStd.Db.Identity;
using ModelStd.IRepository;
using ModelStd.Services;
using MvcMain.Infrastructure;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class UserAdApiController:Controller
    {
        private ICommonRepository _commonRepository;
        private readonly UserManager<AppUser> _userManager;
        private ILogger _logger;

        public UserAdApiController(ICommonRepository commonRepository, UserManager<AppUser> userManager, ILogger logger)
        {
            _commonRepository = commonRepository;
            _userManager = userManager;
            _logger = logger;
        }

        [Authorize]
        public async Task<ResponseBase<IEnumerable<AdvertisementCommon>>> GetUserAds()
        {
            //TODO use Decorator pattern to log
            string errorCode = "UserAdApiController/GetUserAds";
            ResponseBase<IEnumerable<AdvertisementCommon>> response=new ResponseBase<IEnumerable<AdvertisementCommon>>();
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                _logger.LogError($"{errorCode}, user={user.Email}, time= {DateTime.Now}");
                response.ResponseData= await _commonRepository.GetUserAdvertisements(user.Id);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }

            return response;
        }

        [Authorize]
        public async Task<ResponseBase> UpdateAd(Guid adGuid)
        {
            //TODO limit the number of ad updates per ad in a single day
            string errorCode = "UserAdApiController/UpdateAd";
            ResponseBase response=new ResponseBase();
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                await _commonRepository.UpdateAd(adGuid, user.Id);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                ; response.SetFailureResponse(ex.Message, errorCode);
            }
            
            return response;
        }

        [Authorize]
        public async Task<ResponseBase> DeleteAd(Guid adGuid)
        {
            string errorCode = "UserAdApiController/DeleteAd";
            ResponseBase response = new ResponseBase();
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                await _commonRepository.DeleteAd(adGuid, user.Id);
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    response.SetFailureResponse(ex.Message+" ,innerMessage="+ex.InnerException.Message, errorCode);
                }
                else
                {
                    response.SetFailureResponse(ex.Message, errorCode);
                }
            }

            return response;
        }
    }
}
