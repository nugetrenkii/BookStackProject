using BookStack.DTOs.CartBook;
using BookStack.DTOs.Book;

namespace BookStack.DTOs.Cart
{
    public class CartDTO
    {
        public List<CartBookDTO> CartBooks { get; set; }
        public CartDTO() { }
    }
}
