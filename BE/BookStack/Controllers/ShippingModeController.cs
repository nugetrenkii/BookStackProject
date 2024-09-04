﻿using BookStack.Services.ShippingModeService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ShippingModeController : ControllerBase
    {
        private readonly IShippingModeService _shippingModeService;
        public ShippingModeController(IShippingModeService shippingModeService)
        {
            _shippingModeService = shippingModeService;
        }
        [HttpGet("{id}")]
        public IActionResult GetShippingModeById(int id)
        {
            var res = _shippingModeService.GetShippingModeById(id);
            return StatusCode(res.Code, res);
        }
        [HttpGet]
        public IActionResult GetShippingModes(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var res = _shippingModeService.GetShippingModes(page, pageSize, key, sortBy);
            return StatusCode(res.Code, res);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateShippingMode(int id, string name)
        {
            var res = _shippingModeService.UpdateShippingMode(id, name);
            return StatusCode(res.Code, res);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteShippingMode(int id)
        {
            var res = _shippingModeService.DeleteShippingMode(id);
            return StatusCode(res.Code, res);
        }
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult CreateShippingMode(string name)
        {
            var res = _shippingModeService.CreateShippingMode(name);
            return StatusCode(res.Code, res);
        }
    }
}
