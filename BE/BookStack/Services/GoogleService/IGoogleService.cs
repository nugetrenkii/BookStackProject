using Google.Apis.Oauth2.v2.Data;

namespace BookStack.Services.GoogleService;

public interface IGoogleService
{
    Task<Userinfo> GetUserFromCode(string code);
}