using System.Security.Claims;

namespace BookStack.Utilities;

public class UserAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserAccessor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? GetCurrentUserId()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return string.IsNullOrEmpty(userId) ? null : int.Parse(userId);
    }

    public string? GetCurrentUserName()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);
    }

    public string? GetCurrentUserEmail()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email);
    }
        
    public string? GetCurrentUserRole()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);
    }
}