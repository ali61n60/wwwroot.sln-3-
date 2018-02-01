using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Identity;
using ModelStd.IRepository;
using ModelStd.Services;
using RepositoryStd.Context.Helper;
using RepositoryStd.Repository;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Db.Ad;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    public class LetMeKnowApiController: Controller
    {
        private readonly RepositoryContainer _repositoryContainer;
        private readonly UserManager<AppUser> _userManager;

        public LetMeKnowApiController()
        {
            _repositoryContainer = MyService.Inst.GetService<RepositoryContainer>();
            _userManager = MyService.Inst.GetService<UserManager<AppUser>>();
            
        }

        [Authorize]
        public async Task<ResponseBase<int>> AddNewLetMeKnowRecord([FromBody] Dictionary<string, string> userInput)
        {
            string errorCode = "LetMeKnowApi/AddNewLetMeKnowRecord";
            ResponseBase<int> response=new ResponseBase<int>();
            try
            {
                AppUser user = await _userManager.GetUserAsync(HttpContext.User);
                if (user == null)
                {
                    response.SetFailureResponse("user is null", errorCode); //magic string
                    return response;
                }

                int categoryId = ParameterExtractor.ExtractInt(userInput, Category.CategoryIdKey, Category.CategoryIdDefault);
                IAdRepository adRepository = _repositoryContainer.GetAdRepository(categoryId);//polymorphyic dispatch
                await adRepository.AddLetMeKnow(userInput, user.Id);
                response.SetSuccessResponse("Ok",userInput);
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode,userInput);
            }

            return response;
        }
    }
}
