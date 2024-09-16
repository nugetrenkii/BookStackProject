using BookStack.DTOs.Book;

namespace BookStack.DTOs.OrderBook
{
    public class OrderBookDTO
    {
        public BookDTO Book { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
