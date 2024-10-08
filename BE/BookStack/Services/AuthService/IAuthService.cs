﻿using BookStack.DTOs.Response;
using BookStack.DTOs.User;

namespace BookStack.Services.AuthService
{
    public interface IAuthService
    {
        ResponseDTO Login(string username, string password);
        ResponseDTO Register(RegisterUserDTO registerUserDTO);
        Task<ResponseDTO> LoginWithGoogle(string code);
        Task<ResponseDTO> LoginWithFacebook(string code);
        ResponseDTO ChangePassword(ChangePasswordDTO changePasswordDTO);
        Task<ResponseDTO> ForgotPassword(string email);
    }
}
