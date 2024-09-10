using AutoMapper;
using BookStack.DTOs.Response;
using BookStack.DTOs.User;
using BookStack.Entities;
using BookStack.Persistence.Repositories.CartRepository;
using BookStack.Persistence.Repositories.UserRepository;
using BookStack.Services.CacheService;
using BookStack.Services.FacebookService;
using BookStack.Services.GoogleService;
using BookStack.Services.MailService;
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
        private readonly IMailService _mailService;
        private readonly UserAccessor _userAccessor;

        private const string EmailTemplate = $$"""
                                         <!DOCTYPE html>
                                         <html lang="vi">
                                         <head>
                                             <meta charset="UTF-8">
                                             <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                             <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                             <style>
                                                 body {
                                                     font-family: Arial, sans-serif;
                                                     background-color: #f4f4f4;
                                                     margin: 0;
                                                     padding: 20px;
                                                 }
                                                 .email-container {
                                                     background-color: #ffffff;
                                                     max-width: 600px;
                                                     margin: 0 auto;
                                                     padding: 20px;
                                                     border-radius: 8px;
                                                     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                                                 }
                                                 .header {
                                                     text-align: center;
                                                     padding: 10px 0;
                                                 }
                                                 .header h1 {
                                                     color: #333;
                                                 }
                                                 .content {
                                                     padding: 20px 0;
                                                     text-align: center;
                                                 }
                                                 .content p {
                                                     color: #555;
                                                     line-height: 1.5;
                                                 }
                                                 .button {
                                                     display: inline-block;
                                                     padding: 12px 24px;
                                                     margin-top: 20px;
                                                     background-color: #007bff;
                                                     color: #ffffff;
                                                     text-decoration: none;
                                                     border-radius: 5px;
                                                     font-weight: bold;
                                                 }
                                                 .footer {
                                                     text-align: center;
                                                     padding: 10px 0;
                                                     color: #888;
                                                     font-size: 12px;
                                                 }
                                             </style>
                                         </head>
                                         <body>
                                             <div class="email-container">
                                                 <div class="header">
                                                     <h1>BookStack</h1>
                                                 </div>
                                                 <div class="content">
                                                     <p>Xin chào,</p>
                                                     <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                                                     <a href="{resetLink}" class="button">Đặt lại mật khẩu</a>
                                                     <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                                                 </div>
                                                 <div class="footer">
                                                     <p>&copy; 2024 BookStack. All rights reserved.</p>
                                                 </div>
                                             </div>
                                         </body>
                                         </html>
                                 """;
        
        public AuthService(IUserRepository userRepository, 
            ICartRepository cartRepository, IMapper mapper, 
            ITokenService tokenService, IGoogleService googleService, 
            IFacebookService facebookService, 
            ICacheService cacheService,
            UserAccessor userAccessor,
            IMailService mailService)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _mapper = mapper;
            _tokenService = tokenService;
            _googleService = googleService;
            _facebookService = facebookService;
            _cacheService = cacheService;
            _userAccessor = userAccessor;
            _mailService = mailService;
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

        public ResponseDTO ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            var userId = _userAccessor.GetCurrentUserId();
            if (userId != null)
            {
                var user = _userRepository.GetUserById((int)userId);
                if (user == null)
                {
                    return new ResponseDTO()
                    {
                        Code = 400,
                        Message = "User không tồn tại"
                    };
                }
                if (!PasswordHelper.VerifyPasswordHash(changePasswordDTO.OldPassword, user.PasswordHash, user.PasswordSalt))
                    return new ResponseDTO()
                    {
                        Code = 400,
                        Message = "Mật khẩu cũ không đúng"
                    };
                if (changePasswordDTO.NewPassword != changePasswordDTO.CfPassword)
                    return new ResponseDTO()
                    {
                        Code = 400,
                        Message = "Mật khẩu không trùng khớp",
                    };
                PasswordHelper.CreatePasswordHash(changePasswordDTO.NewPassword, out var passwordHash, out var passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                _userRepository.UpdateUser(user);
                if (_userRepository.IsSaveChanges())
                {
                    return new ResponseDTO()
                    {
                        Code = 200,
                        Message = "Thay đổi mật khẩu thành công"
                    };
                }
            }
            return new ResponseDTO()
            {
                Code = 400,
                Message = "Thay đổi mật khẩu thất bại",
            };
        }

        public async Task<ResponseDTO> ForgotPassword(string email)
        {
            var user = _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "User không tồn tại"
                };
            }
            
            var token = _tokenService.GenerateToken(user);
            var resetLink = $"https://localhost:3001/reset-password?token={token}";
            var message = EmailTemplate.Replace("{resetLink}", resetLink);
            await _mailService.SendEmailAsync(email, "Yêu cầu đổi mật khẩu", message);
            return new ResponseDTO()
            {
                Code = 200,
                Message = "Gửi link quên mật khẩu thành công"
            };
        }
    }
}
