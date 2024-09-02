﻿using System.ComponentModel.DataAnnotations;

namespace BookStack.DTOs.User
{
    public class RegisterUserDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string CfPassword { get; set; }
    }
}
