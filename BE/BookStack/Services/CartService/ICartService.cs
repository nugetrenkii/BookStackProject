using BookStack.DTOs.Response;

namespace BookStack.Services.CartService
{
    public interface ICartService
    {
        ResponseDTO GetCartByUser(int  userId);
        ResponseDTO AddToCart(int  userId, int bookId, int count);
    }
}
