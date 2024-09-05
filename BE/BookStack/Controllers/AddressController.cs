using BookStack.DTOs.Address;
using BookStack.Services.AddressService;
using BookStack.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;
        public AddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }
        [HttpPost]
        public IActionResult CreateAddress(CreateAddressDTO createAddressDTO)
        {
            var res = _addressService.CreateAddress(createAddressDTO);
            return StatusCode(res.Code, res);
        }
        [HttpPost("User/Self")]
        public IActionResult SelfCreateAddress(SelfCreateAddressDTO selfCreateAddressDTO)
        {
            var res = _addressService.SelfCreateAddress(selfCreateAddressDTO);
            return StatusCode(res.Code, res);
        }
        [HttpGet("{id}")]
        public IActionResult GetAddressById(int id)
        {
            var res = _addressService.GetAddressById(id);
            return StatusCode(res.Code, res);
        }
        [HttpGet("User/{id}")]
        public IActionResult GetAddressByUser(int id)
        {
            var res = _addressService.GetAddressByUser(id);
            return StatusCode(res.Code, res);
        }
        
        [HttpGet("User/Self")]
        public IActionResult GetSelfAddresses()
        {
            var res = _addressService.GetSelfAddresses();
            return StatusCode(res.Code, res);
        }
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult GetAddresses(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var res = _addressService.GetAddresses(page, pageSize, key, sortBy);
            return StatusCode(res.Code, res);
        }
        [HttpPut("{id}")]
        public IActionResult UpdateAddress(int id, UpdateAddressDTO updateAddressDTO)
        {
            var res = _addressService.UpdateAddress(id, updateAddressDTO);
            return StatusCode(res.Code, res);
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteAddress(int id)
        {
            var res = _addressService.DeleteAddress(id);
            return StatusCode(res.Code, res);
        }
    }
}
