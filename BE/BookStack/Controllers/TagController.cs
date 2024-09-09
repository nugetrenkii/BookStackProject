using BookStack.DTOs.Tag;
using BookStack.Services.TagService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class TagController : ControllerBase
    {
        private readonly ITagService _tagService;
        public TagController(ITagService tagService)
        {
            _tagService = tagService;
        }
        [HttpGet("{id}")]
        public IActionResult GetTagById(int id)
        {
            var res = _tagService.GetTagById(id);
            return StatusCode(res.Code, res);
        }
        [HttpGet]
        public IActionResult GetTags(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var res = _tagService.GetTags(page, pageSize, key, sortBy);
            return StatusCode(res.Code, res);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateTag(int id, string name)
        {
            var res = _tagService.UpdateTag(id, name);
            return StatusCode(res.Code, res);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteTag(int id)
        {
            var res = _tagService.DeleteTag(id);
            return StatusCode(res.Code, res);
        }
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult CreateTag(CreateTagDTO createTagDTO)
        {
            var res = _tagService.CreateTag(createTagDTO);
            return StatusCode(res.Code, res);
        }
    }
}
