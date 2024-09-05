using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Oauth2.v2;
using Google.Apis.Oauth2.v2.Data;
using Google.Apis.Services;

namespace BookStack.Services.GoogleService;

public class GoogleService : IGoogleService
{
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _redirectUri;
    
    public GoogleService(IConfiguration config)
    {
        _clientId = config["GoogleSettings:ClientId"] ?? throw new InvalidOperationException();
        _clientSecret = config["GoogleSettings:ClientSecret"] ?? throw new InvalidOperationException();
        _redirectUri = config["GoogleSettings:RedirectUri"] ?? throw new InvalidOperationException();
    }
    
    public async Task<Userinfo> GetUserFromCode(string code)
    {
        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = _clientId,
                ClientSecret = _clientSecret
            },
            Scopes = new[] { "email", "profile" },
        });

        var token = await flow.ExchangeCodeForTokenAsync(string.Empty, code, _redirectUri, CancellationToken.None);

        var credentials = new UserCredential(flow, string.Empty, token);

        var service = new Oauth2Service(new BaseClientService.Initializer
        {
            HttpClientInitializer = credentials,
            ApplicationName = "RadzenBook"
        });

        return await service.Userinfo.Get().ExecuteAsync();
    }
}