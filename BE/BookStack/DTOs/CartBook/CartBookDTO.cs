using BookStack.DTOs.Book;

namespace BookStack.DTOs.CartBook
{
    public class CartBookDTO
    {
        public BookDTO Book { get; set; }
        public int Quantity { get; set; }
    }
}
