using AutoMapper;
using BookStack.DTOs.Response;
using BookStack.DTOs.User;
using BookStack.Entities;
using BookStack.Persistence.Repositories.CartRepository;
using BookStack.Persistence.Repositories.UserRepository;
using BookStack.Services.CacheService;
using BookStack.Services.FacebookService;
using BookStack.Services.GoogleService;
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
        private readonly IGoogleService _googleService;
        private readonly IFacebookService _facebookService;
        private readonly ICacheService _cacheService;
        public AuthService(IUserRepository userRepository, 
            ICartRepository cartRepository, IMapper mapper, 
            ITokenService tokenService, IGoogleService googleService, 
            IFacebookService facebookService, 
            ICacheService cacheService)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _mapper = mapper;
            _tokenService = tokenService;
            _googleService = googleService;
            _facebookService = facebookService;
            _cacheService = cacheService;
        }
        public ResponseDTO Login(string username, string password)
        {
            var user = _userRepository.GetUserByUsername(username);
            
            if (user is { IsDeleted: false })
            {
                if (PasswordHelper.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
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
            var email = _userRepository.GetUserByEmail(registerUserDTO.Email);
            if (email != null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Email đã đăng ký"
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

        public async Task<ResponseDTO> LoginWithGoogle(string code)
        {
            var userinfo = await _googleService.GetUserFromCode(code);
            var user = _userRepository.GetUserByEmail(userinfo.Email);
            string token;
            UserDTO data;
            if (user == null)
            {
                var nameParts = userinfo.Name.Split(" ");
                var newUser = new User
                {
                    Username = userinfo.Email,
                    Email = userinfo.Email,
                    FirstName = nameParts[0],
                    LastName = nameParts.Length > 1 ? string.Join(" ", nameParts.Skip(1)) : string.Empty,
                    Avatar = userinfo.Picture,
                    IsVerified = true,
                    RoleId = 2
                };
                _userRepository.CreateUser(newUser);
                if (_userRepository.IsSaveChanges())
                {
                    var userActual = _userRepository.GetUserByEmail(userinfo.Email);
                    token = _tokenService.GenerateToken(userActual);
                    data = _mapper.Map<UserDTO>(userActual);
                    data.Token = token;
                    return new ResponseDTO()
                    {
                        Message = "Login thành công",
                        Data = data
                    };
                }

                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Login thất bại"
                };
            }
            
            token = _tokenService.GenerateToken(user);
            data = _mapper.Map<UserDTO>(user);
            data.Token = token;
            return new ResponseDTO()
            {
                Message = "Login thành công",
                Data = data
            };
        }

        public async Task<ResponseDTO> LoginWithFacebook(string code)
        {
            var userinfo = await _facebookService.GetUserFromCode(code);
            var user = _userRepository.GetUserByEmail(userinfo.Email);
            string token;
            UserDTO data;
            if (user == null)
            {
                var nameParts = userinfo.Name.Split(" ");
                var newUser = new User
                {
                    Username = userinfo.Email,
                    Email = userinfo.Email,
                    FirstName = nameParts[0],
                    LastName = nameParts.Length > 1 ? string.Join(" ", nameParts.Skip(1)) : string.Empty,
                    Avatar = userinfo.Picture,
                    IsVerified = true,
                    RoleId = 2
                };
                _userRepository.CreateUser(newUser);
                if (_userRepository.IsSaveChanges())
                {
                    var userActual = _userRepository.GetUserByEmail(userinfo.Email);
                    token = _tokenService.GenerateToken(userActual);
                    data = _mapper.Map<UserDTO>(userActual);
                    data.Token = token;
                    return new ResponseDTO()
                    {
                        Message = "Login thành công",
                        Data = data
                    };
                }

                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Login thất bại"
                };
            }
            
            token = _tokenService.GenerateToken(user);
            data = _mapper.Map<UserDTO>(user);
            data.Token = token;
            return new ResponseDTO()
            {
                Message = "Login thành công",
                Data = data
            }; 
        }
    }
}
