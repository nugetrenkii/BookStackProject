using AutoMapper;
using BookStack.DTOs.Cart;
using BookStack.DTOs.CartBook;
using BookStack.DTOs.Response;
using BookStack.Entities;
using BookStack.Persistence.Repositories.BookRepository;
using BookStack.Persistence.Repositories.CartRepository;
using BookStack.Persistence.Repositories.QuantityRepository;
using BookStack.Persistence.Repositories.UserRepository;
using BookStack.Utilities;

namespace BookStack.Services.CartService
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IUserRepository _userRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IQuantityRepository _quantityRepository;
        private readonly IMapper _mapper;
        private readonly UserAccessor _userAccessor;
        public CartService(ICartRepository cartRepository, IMapper mapper, IUserRepository userRepository, IQuantityRepository quantityRepository, IBookRepository bookRepository, UserAccessor userAccessor)
        {
            _cartRepository = cartRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _bookRepository = bookRepository;
            _userAccessor = userAccessor;
            _quantityRepository = quantityRepository;
        }

        public ResponseDTO AddToCart(int userId, int bookId, int count)
        {
            var book = _bookRepository.GetBookById(bookId);
            if (book == null) return new ResponseDTO { Code = 400, Message = "Book không tồn tại" };

            var cart = _cartRepository.GetCartByUser(userId);
            if (cart == null) return new ResponseDTO { Code = 400, Message = "Cart của user không tồn tại" };
            
            if (count > book.Count) return new ResponseDTO { Code = 400, Message = "Sản phẩm hiện không đủ số lượng để thêm" };
            
            if(count > book.MaxOrder) return new ResponseDTO { Code = 400, Message = "Số lượng vượt quá số lượng tối đa có thể đặt hàng" };

            if (cart.CartBooks.FirstOrDefault(b => b.Book.Id == bookId) == null)
            {
                cart.CartBooks.Add(
                    new CartBook()
                    {
                        CartId = cart.Id,
                        BookId = bookId,
                        Quantity = count
                    });
            }
            else
                for (int i = 0; i < cart.CartBooks.Count; i++)
                {
                    if (cart.CartBooks[i].Book.Id == bookId)
                    {
                        if (cart.CartBooks[i].Quantity + count > book.Count) return new ResponseDTO { Code = 400, Message = "Sản phẩm hiện không đủ số lượng để thêm" };
                        if (cart.CartBooks[i].Quantity + count > book.MaxOrder) return new ResponseDTO { Code = 400, Message = "Số lượng vượt quá số lượng tối đa có thể đặt hàng" };
                        if (cart.CartBooks[i].Quantity + count == 0) cart.CartBooks.RemoveAt(i);
                        else
                            cart.CartBooks[i].Quantity += count;
                        break;
                    }
                }

            cart.Update = DateTime.Now;
            _cartRepository.UpdateCart(cart);
            if (_cartRepository.IsSaveChanges())
            {
                var tmp = _cartRepository.GetCartByUser(userId);
                return new ResponseDTO()
                {
                    Message = "Cập nhật thành công"
                };
            }
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Cập nhật thất bại"
            };

        }
        
        public ResponseDTO SelfAddToCart(int bookId, int count)
        {
            var userId = _userAccessor.GetCurrentUserId();
            if (userId != null) return AddToCart((int)userId, bookId, count);
            return new ResponseDTO
            {
                Code = 400,
                Message = "User không tồn tại"
            };
        }

        public ResponseDTO GetCartByUser(int userId)
        {
            var cart = _cartRepository.GetCartByUser(userId);
            if (cart != null)
            {
                CartDTO cartDTO = new CartDTO();
                List<CartBookDTO> tmp = _mapper.Map<List<CartBookDTO>>(cart.CartBooks);
                cartDTO.CartBooks = tmp;
                return new ResponseDTO
                {
                    Data = tmp
                };
            }
            else return new ResponseDTO
            {
                Code = 400,
                Message = "Giỏ hàng của user này không tồn tại"
            };
        }

        public ResponseDTO GetSelfCart()
        {
            var userId = _userAccessor.GetCurrentUserId();
            if (userId != null) return GetCartByUser((int)userId);
            return new ResponseDTO
            {
                Code = 400,
                Message = "User không tồn tại"
            };
        }

        //public ResponseDTO UpdateCart(int userId, int bookId, int count)
        //{
        //    var cart = _cartRepository.GetCartByUser(userId);
        //    if (cart == null) return new ResponseDTO { Code = 400, Message = "Cart của user không tồn tại" };
        //    for (int i = 0; i < cart.Books.Count(); i++)
        //    {
        //        if (cart.Books[i].Id == bookId)
        //        {
        //            if (count == 0)
        //            {
        //                cart.Books.RemoveAt(i);
        //                cart.Quantities.RemoveAt(i);
        //            }
        //            var quantity = _quantityRepository.GetQuantity(count);
        //            if (quantity != null)
        //            {
        //                cart.Quantities[i] = quantity;
        //            }
        //            else
        //            {
        //                _quantityRepository.CreateQuantity(count);
        //                if (_quantityRepository.IsSaveChanges())
        //                {
        //                    quantity = _quantityRepository.GetQuantity(count);
        //                    if (quantity != null)
        //                    {
        //                        cart.Quantities[i] = quantity;
        //                    }
        //                }

        //            }

        //            break;
        //        }
        //    }

        //    cart.Update = DateTime.Now;
        //    _cartRepository.UpdateCart(cart);
        //    if (_cartRepository.IsSaveChanges())
        //        return new ResponseDTO()
        //        {
        //            Message = "Cập nhật thành công"
        //        };
        //    else return new ResponseDTO()
        //    {
        //        Code = 400,
        //        Message = "Cập nhật thất bại"
        //    };
        //}
    }
}
