using BookStack.DTOs.User;
using BookStack.Services.AuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("Login")]
        public ActionResult Login(LoginDTO loginDTO)
        {
            var res = _authService.Login(loginDTO.Username, loginDTO.Password);
            return StatusCode(res.Code, res);
        }
        [HttpPost("Register")]
        public ActionResult Register(RegisterUserDTO registerUserDTO)
        {
            var res = _authService.Register(registerUserDTO);
            return StatusCode(res.Code, res);
        }
    }
}
