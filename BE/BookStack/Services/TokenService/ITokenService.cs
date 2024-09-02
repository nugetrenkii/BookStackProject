using BookStack.Entities;

namespace BookStack.Services.TokenService;

public interface ITokenService
{
    string GenerateToken(User user);
}