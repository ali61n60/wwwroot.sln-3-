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

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class UserAdApiController:Controller
    {
        private ICommonRepository _commonRepository;
        private readonly UserManager<AppUser> _userManager;

        public UserAdApiController(ICommonRepository commonRepository, UserManager<AppUser> userManager)
        {
            _commonRepository = commonRepository;
            _userManager = userManager;
        }

        [Authorize]
        public async Task<ResponseBase<IEnumerable<AdvertisementCommon>>> GetUserAds()
        {
            string errorCode = "UserAdApiController/GetUserAds";
            ResponseBase<IEnumerable<AdvertisementCommon>> response=new ResponseBase<IEnumerable<AdvertisementCommon>>();
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
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
    }
}
