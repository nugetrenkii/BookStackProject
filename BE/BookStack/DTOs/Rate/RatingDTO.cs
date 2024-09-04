using BookStack.DTOs.Book;
using BookStack.DTOs.User;

namespace BookStack.DTOs.Rate
{
    public class RatingDTO
    {
        public int Id { get; set; }
        public int Rate { get; set; }
        public string Comment { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime Create { get; set; }
        public UserDTO User { get; set; } = new();
        public BookDTO Book { get; set; } = new();
    }
}
