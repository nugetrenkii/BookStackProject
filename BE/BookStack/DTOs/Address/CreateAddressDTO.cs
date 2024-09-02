﻿namespace BookStack.DTOs.Address
{
    public class CreateAddressDTO
    {
        public string Name { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Phone { get; set; }
        public int UserId { get; set; }
    }
}
