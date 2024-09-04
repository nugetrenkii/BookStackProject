using AutoMapper;
using BookStack.DTOs.Response;
using BookStack.DTOs.User;
using BookStack.Entities;
using BookStack.Persistence.Repositories.CartRepository;
using BookStack.Persistence.Repositories.UserRepository;
using BookStack.Services.TokenService;
using BookStack.Utilities;
using Microsoft.AspNetCore.Authorization;

namespace BookStack.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ITokenService _tokenService;
        public AuthService(IUserRepository userRepository, ICartRepository cartRepository, IMapper mapper, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _mapper = mapper;
            _tokenService = tokenService;
        }
        public ResponseDTO Login(string username, string password)
        {
            var user = _userRepository.GetUserByUsername(username);

            if (user != null && PasswordHelper.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt) && user.IsDeleted == false)
            {
                var token = _tokenService.GenerateToken(user);
                var data = _mapper.Map<UserDTO>(user);
                data.Token = token;
                return new ResponseDTO()
                {
                    Message = "Login thành công",
                    Data = data
                };
            }
            return new ResponseDTO()
            {
                Code = 401,
                Message = "Tài khoản hoặc mật khẩu không chính xác" 
            };
        }
        public ResponseDTO Register(RegisterUserDTO registerUserDTO)
        {
            var user = _userRepository.GetUserByUsername(registerUserDTO.Username);
            if (user != null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Username đã tồn tại"
                };
            if (registerUserDTO.Password != registerUserDTO.CfPassword)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Password không trùng khớp"
                };
            user = _mapper.Map<User>(registerUserDTO);
            user.RoleId = 2;
            PasswordHelper.CreatePasswordHash(registerUserDTO.Password, out var passwordHash, out var passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            
            _userRepository.CreateUser(user);
            if (_userRepository.IsSaveChanges())
            {
                return new ResponseDTO()
                {
                    Message = "Tạo thành công"
                };
            }
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Tạo thất bại"
            };
        }
    }
}
