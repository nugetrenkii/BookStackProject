using BookStack.Services.PublisherService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublisherController : ControllerBase
    {
        private readonly IPublisherService _publisherService;
        public PublisherController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }
        [HttpGet("{id}")]
        public IActionResult GetPublisherById(int id)
        {
            var res = _publisherService.GetPublisherById(id);
            return StatusCode(res.Code, res);
        }
        [HttpGet]
        public IActionResult GetPublishers(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var res = _publisherService.GetPublishers(page, pageSize, key, sortBy);
            return StatusCode(res.Code, res);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdatePublisher(int id, string name)
        {
            var res = _publisherService.UpdatePublisher(id, name);
            return StatusCode(res.Code, res);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeletePublisher(int id)
        {
            var res = _publisherService.DeletePublisher(id);
            return StatusCode(res.Code, res);
        }
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult CreatePublisher(string name)
        {
            var res = _publisherService.CreatePublisher(name);
            return StatusCode(res.Code, res);
        }
    }
}
