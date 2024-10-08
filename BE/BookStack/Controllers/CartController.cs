﻿using BookStack.DTOs.Cart;
using BookStack.Services.CartService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }
        [HttpGet("{userId}")]
        public IActionResult GetCartByUser(int userId)
        {
            var res = _cartService.GetCartByUser(userId);
            return StatusCode(res.Code, res);
        }
        [HttpGet("Self")]
        public IActionResult GetSelfCart()
        {
            var res = _cartService.GetSelfCart();
            return StatusCode(res.Code, res);
        }
        //get self cart
        //[HttpPost("{userId}")]
        //public IActionResult CreateCart(int userId, CreateCartDTO createCartDTO)
        //{
        //    var res = _cartService.CreateCart(userId, createCartDTO);
        //    return StatusCode(res.Code, res);
        //}
        //[HttpPut("{userId}")]
        //public IActionResult UpdateCart(int userId, int bookId, int count)
        //{
        //    var res = _cartService.UpdateCart(userId, bookId, count);
        //    return StatusCode(res.Code, res);
        //}
        [HttpPut("{userId}")]
        public IActionResult AddToCart(int userId, int bookId, int count)
        {
            var res = _cartService.AddToCart(userId, bookId, count);
            return StatusCode(res.Code, res);
        }

        [HttpPut("Self")]
        public IActionResult SelfAddToCart(int bookId, int count)
        {
            var res = _cartService.SelfAddToCart(bookId, count);
            return StatusCode(res.Code, res);
        }
    }
}
