﻿using BookStack.DTOs.Book;
using BookStack.Services.BookService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }
        [HttpGet("{id}")]
        public IActionResult GetBookById(int id)
        {
            var res = _bookService.GetBookById(id);
            return StatusCode(res.Code, res);
        }
        [HttpPost("ids")]
        public IActionResult GetBookByIds(List<int> ids)
        {
            var res = _bookService.GetBookByIds(ids);
            return StatusCode(res.Code, res);
        }
        [HttpGet]
        public IActionResult GetBooks(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID", int? tagId = 0)
        {
            var res = _bookService.GetBooks(page, pageSize, key, sortBy, tagId);
            return StatusCode(res.Code, res);
        }

        [HttpGet("Recommendations")]
        public IActionResult GetBookRecommendations()
        {
            var res = _bookService.GetBookRecommendations();
            return StatusCode(res.Code, res);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateBook(int id, UpdateBookDTO updateBookDTO)
        {
            var res = _bookService.UpdateBook(id, updateBookDTO);
            return StatusCode(res.Code, res);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteBook(int id)
        {
            var res = _bookService.DeleteBook(id);
            return StatusCode(res.Code, res);
        }
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult CreateBook(CreateBookDTO createBookDTO)
        {
            var res = _bookService.CreateBook(createBookDTO);
            return StatusCode(res.Code, res);
        }

        //[HttpGet("Cart")]
        //public IActionResult GetCart(List<int> bookIds)
        //{
        //    var res = _bookService.GetCart(bookIds);
        //    return StatusCode(res.Code, res);
        //}
    }
}
