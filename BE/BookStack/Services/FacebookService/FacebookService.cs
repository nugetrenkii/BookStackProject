using BookStack.DTOs.Facebook;
using Facebook;

namespace BookStack.Services.FacebookService;

public class FacebookService : IFacebookService
{
    private readonly string _redirectUri;
    private readonly string _clientId;
    private readonly string _clientSecret;
    
    public FacebookService(IConfiguration config)
    {
        _redirectUri = config["FacebookSettings:RedirectUri"] ?? throw new InvalidOperationException();
        _clientId = config["FacebookSettings:AppId"] ?? throw new InvalidOperationException();
        _clientSecret = config["FacebookSettings:AppSecret"] ?? throw new InvalidOperationException();
    }
    
    public async Task<UserInfo> GetUserFromCode(string token)
    {
        var fb = new FacebookClient();

        dynamic result = fb.Post("oauth/access_token", new
        {
            client_id = _clientId,
            client_secret = _clientSecret,
            redirect_uri = _redirectUri,
            code = token
        });

        var accessToken = result.access_token;

        fb.AccessToken = accessToken;

        dynamic me = await fb.GetTaskAsync("me", new { fields = "id,name,email,picture.width(100).height(100)" });

        var userinfo = new UserInfo
        {
            Id = me.id,
            Name = me.name,
            Email = string.IsNullOrEmpty(me.email) ? $"{me.id + "@facebook.com"}" : me.email,
            Picture = me.picture.data.url
        };

        return userinfo;
    } 
}