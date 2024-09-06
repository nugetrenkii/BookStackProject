using BookStack.DTOs.Rate;
using BookStack.Services.RatingService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;
        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }
        [HttpGet("{id}")]
        public IActionResult GetRatingById(int id)
        {
            var res = _ratingService.GetRatingById(id);
            return StatusCode(res.Code, res);
        }
        [HttpGet]
        public IActionResult GetRatings(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var res = _ratingService.GetRatings(page, pageSize, key, sortBy);
            return StatusCode(res.Code, res);
        }
        [HttpGet("Book")]
        public IActionResult GetRatingByBook(int bookId, int? page = 1)
        {
            var res = _ratingService.GetRatingByBook(bookId, page);
            return StatusCode(res.Code, res);
        }
        //[HttpPut("{id}")]
        //public IActionResult UpdateRating(int id, string name)
        //{
        //    var res = _ratingService.UpdateRating(id, name);
        //    return StatusCode(res.Code, res);
        //}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteRating(int id)
        {
            var res = _ratingService.DeleteRating(id);
            return StatusCode(res.Code, res);
        }
        [HttpPost]
        [Authorize]
        public IActionResult CreateRating(CreateRatingDTO createRatingDTO)
        {
            var res = _ratingService.CreateRating(createRatingDTO);
            return StatusCode(res.Code, res);
        }

        [HttpPost("Self")]
        public IActionResult SelfRating(SelfCreateRatingDTO selfCreateRatingDto)
        {
            var res = _ratingService.SelfRating(selfCreateRatingDto);
            return StatusCode(res.Code, res);
        }
    }
}
