using BookStack.DTOs.Response;

namespace BookStack.Services.CartService
{
    public interface ICartService
    {
        ResponseDTO GetCartByUser(int  userId);
        ResponseDTO GetSelfCart();
        ResponseDTO AddToCart(int  userId, int bookId, int count);
        ResponseDTO SelfAddToCart(int bookId, int count);
    }
}
