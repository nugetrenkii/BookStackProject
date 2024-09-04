using AutoMapper;
using BookStack.DTOs.Order;
using BookStack.DTOs.OrderBook;
using BookStack.DTOs.Response;
using BookStack.Entities;
using BookStack.Persistence.Repositories.AddressRepository;
using BookStack.Persistence.Repositories.BookRepository;
using BookStack.Persistence.Repositories.CartRepository;
using BookStack.Persistence.Repositories.OrderRepository;
using BookStack.Persistence.Repositories.QuantityRepository;
using BookStack.Persistence.Repositories.ShippingModeRepository;
using BookStack.Persistence.Repositories.UserRepository;

namespace BookStack.Services.OrderService
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IUserRepository _userRepository;
        private readonly IShippingModeRepository _shippingModeRepository;
        private readonly IAddressRepository _addressRepository;
        private readonly IQuantityRepository _quantityRepository;
        private readonly IMapper _mapper;
        private readonly ICartRepository _cartRepository;

        public OrderService(IOrderRepository orderRepository, IMapper mapper, IBookRepository bookRepository,
            IUserRepository userRepository, IShippingModeRepository shippingModeRepository,
            IAddressRepository addressRepository, IQuantityRepository quantityRepository, ICartRepository cartRepository
            )
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
            _bookRepository = bookRepository;
            _userRepository = userRepository;
            _shippingModeRepository = shippingModeRepository;
            _quantityRepository = quantityRepository;
            _addressRepository = addressRepository;
            _cartRepository = cartRepository;
        }

        public ResponseDTO CreateOrder(CreateOrderDTO createOrderDTO)
        {
            var user = _userRepository.GetUserById(createOrderDTO.UserId);
            if (user == null) return new ResponseDTO()
            {
                Code = 400,
                Message = "User không tồn tại"
            };

            var cart = _cartRepository.GetCartByUser(user.Id);

            var shippingMode = _shippingModeRepository.GetShippingModeById(createOrderDTO.ShippingModeId);
            if (shippingMode == null) return new ResponseDTO()
            {
                Code = 400,
                Message = "ShippingMode không tồn tại"
            };

            var address = _addressRepository.GetAddressById(createOrderDTO.AddressId);
            if (address == null) return new ResponseDTO()
            {
                Code = 400,
                Message = "Address không tồn tại"
            };

            if (user.Addresses.IndexOf(address) < 0)
            {
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Địa chỉ không hợp lệ"
                };
            }

            var order = _mapper.Map<Order>(createOrderDTO);

            for (int i = 0; i < createOrderDTO.BookIds.Count; i++)
            {
                var book = _bookRepository.GetBookById(createOrderDTO.BookIds[i]);
                if (book != null)
                {
                    order.OrderBooks.Add(new OrderBook()
                    {
                        BookId = book.Id,
                        Quantity = createOrderDTO.QuantitieCounts[i],
                    });
                }
            }

            _orderRepository.CreateOrder(order);
            if (_orderRepository.IsSaveChanges())
            {
                //after create need clear cart
                _cartRepository.ClearCartBook(order.OrderBooks.Select(c => c.BookId).ToList());
                return new ResponseDTO()
                {
                    Message = "Tạo thành công"
                };
            }
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Tạo thất bại"
            };
        }

        public ResponseDTO DeleteOrder(int id)
        {
            var order = _orderRepository.GetOrderById(id);
            if (order == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Order không tồn tại"
                };

            order.IsDeleted = true;
            _orderRepository.UpdateOrder(order);
            if (_orderRepository.IsSaveChanges())
                return new ResponseDTO()
                {
                    Message = "Xóa thành công"
                };
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Xóa thất bại"
            };
        }

        public ResponseDTO GetOrderByUser(int userId, int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var user = _userRepository.GetUserById(userId);
            if (user == null) return new ResponseDTO()
            {
                Code = 400,
                Message = "User không tồn tại"
            };

            var orders = _orderRepository.GetOrderByUser(userId, page, pageSize, key, sortBy);
            return new ResponseDTO()
            {
                Code = 200,
                Data = _mapper.Map<List<OrderDTO>>(orders),
            };
        }

        public ResponseDTO GetOrderById(int id)
        {
            var order = _orderRepository.GetOrderById(id);
            if (order == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Order không tồn tại"
                };

            OrderDTO orderDTO = _mapper.Map<OrderDTO>(order);
            List<OrderBookDTO> tmp = _mapper.Map<List<OrderBookDTO>>(order.OrderBooks);
            orderDTO.OrderBooks = tmp;
            orderDTO.TotalPrice = tmp.Sum(b => b.Book.Price * b.Quantity);
            return new ResponseDTO
            {
                Data = orderDTO
            };
        }

        public ResponseDTO GetOrders(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID", string? status = "")
        {
            var orders = _orderRepository.GetOrders(page, pageSize, key, sortBy, status);
            var tmp = _mapper.Map<List<OrderDTO>>(orders);
            tmp.ForEach(c => c.TotalPrice = c.OrderBooks.Sum(b => b.Book.Price * b.Quantity));
            return new ResponseDTO()
            {
                Data = tmp,
                Total = _orderRepository.GetOrderCount()
            };
        }

        public ResponseDTO UpdateOrder(int id, UpdateOrderDTO updateOrderDTO)
        {
            var order = _orderRepository.GetOrderById(id);
            if (order == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Order không tồn tại"
                };

            order.Update = DateTime.Now;
            order.Status = updateOrderDTO.Status;
            order.Description = updateOrderDTO.Description;
            order.ShippingModeId = updateOrderDTO.ShippingModeId;

            _orderRepository.UpdateOrder(order);
            if (_orderRepository.IsSaveChanges())
                return new ResponseDTO()
                {
                    Message = "Cập nhật thành công"
                };
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Cập nhật thất bại"
            };
        }
    }
}
