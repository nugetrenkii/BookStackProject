using BookStack.DTOs.Rate;
using System.ComponentModel.DataAnnotations;
using BookStack.DTOs.Author;
using BookStack.DTOs.Publisher;
using BookStack.DTOs.Tag;

namespace BookStack.DTOs.Book
{
    public class BookDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int NumberOfPages { get; set; }
        public DateTime PublishDate { get; set; }
        public string Language { get; set; }
        public int Count { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public bool IsDeleted { get; set; }
        public virtual PublisherDTO Publisher { get; set; }
        public virtual AuthorDTO Author { get; set; }
        public virtual List<TagDTO> Tags { get; set; }
    }
}
