using BookStack.DTOs.Facebook;

namespace BookStack.Services.FacebookService;

public interface IFacebookService
{
    Task<UserInfo> GetUserFromCode(string code);
}