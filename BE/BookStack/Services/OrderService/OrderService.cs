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
using BookStack.Utilities;

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
        private readonly UserAccessor _userAccessor;

        public OrderService(IOrderRepository orderRepository, IMapper mapper, IBookRepository bookRepository,
            IUserRepository userRepository, IShippingModeRepository shippingModeRepository,
            IAddressRepository addressRepository, IQuantityRepository quantityRepository, ICartRepository cartRepository, UserAccessor userAccessor)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
            _bookRepository = bookRepository;
            _userRepository = userRepository;
            _shippingModeRepository = shippingModeRepository;
            _quantityRepository = quantityRepository;
            _addressRepository = addressRepository;
            _cartRepository = cartRepository;
            _userAccessor = userAccessor;
        }

        public ResponseDTO CreateOrder(CreateOrderDTO createOrderDTO)
        {
            var user = _userRepository.GetUserById(createOrderDTO.UserId);
            if (user == null) return new ResponseDTO()
            {
                Code = 400,
                Message = "User không tồn tại"
            };
            
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
                // Retrieve the OrderId after SaveChanges
                var orderId = order.Id;

                // Update book quantities
                foreach (var orderBook in order.OrderBooks)
                {
                    var book = _bookRepository.GetBookById(orderBook.BookId);
                    if (book != null)
                    {
                        // Ensure the book has enough stock
                        if (book.Count >= orderBook.Quantity)
                        {
                            book.Count -= orderBook.Quantity;
                            _bookRepository.UpdateBook(book);
                        }
                        else
                        {
                            return new ResponseDTO()
                            {
                                Code = 400,
                                Message = $"Không đủ số lượng cho sách ID {book.Id}"
                            };
                        }
                    }
                }

                // Save changes for the updated book quantities
                if (_bookRepository.IsSaveChanges())
                {
                    // Clear cart books
                    _cartRepository.ClearCartBook(order.OrderBooks.Select(c => c.BookId).ToList());

                    return new ResponseDTO()
                    {
                        Message = "Tạo thành công",
                        Data = orderId // Return the OrderId in response
                    };
                }

                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Cập nhật số lượng sách thất bại"
                };
            }

            return new ResponseDTO()
            {
                Code = 400,
                Message = "Tạo thất bại"
            };
        }

        public ResponseDTO SelfCreateOrder(SelfCreateOrderDTO selfCreateOrderDTO)
        {
            var userId = _userAccessor.GetCurrentUserId();
            if (userId != null)
            {
                var user = _userRepository.GetUserById((int)userId);
                if (user == null)
                    return new ResponseDTO()
                    {
                        Code = 400,
                        Message = "User không tồn tại"
                    };

                var shippingMode = _shippingModeRepository.GetShippingModeById(selfCreateOrderDTO.ShippingModeId);
                if (shippingMode == null)
                    return new ResponseDTO()
                    {
                        Code = 400,
                        Message = "ShippingMode không tồn tại"
                    };

                var address = _addressRepository.GetAddressById(selfCreateOrderDTO.AddressId);
                if (address == null)
                    return new ResponseDTO()
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

                var order = _mapper.Map<Order>(selfCreateOrderDTO);
                order.UserId = (int)userId;

                for (int i = 0; i < selfCreateOrderDTO.BookIds.Count; i++)
                {
                    var book = _bookRepository.GetBookById(selfCreateOrderDTO.BookIds[i]);
                    if (book != null)
                    {
                        order.OrderBooks.Add(new OrderBook()
                        {
                            BookId = book.Id,
                            Quantity = selfCreateOrderDTO.QuantitieCounts[i],
                        });
                    }
                }

                _orderRepository.CreateOrder(order);

                // Check if save changes were successful
                if (_orderRepository.IsSaveChanges())
                {
                    // Retrieve the OrderId after SaveChanges
                    var orderId = order.Id;

                    // Update book quantities
                    foreach (var orderBook in order.OrderBooks)
                    {
                        var book = _bookRepository.GetBookById(orderBook.BookId);
                        if (book != null)
                        {
                            // Ensure the book has enough stock
                            if (book.Count >= orderBook.Quantity)
                            {
                                book.Count -= orderBook.Quantity;
                                _bookRepository.UpdateBook(book);
                            }
                            else
                            {
                                return new ResponseDTO()
                                {
                                    Code = 400,
                                    Message = $"Không đủ số lượng cho sách ID {book.Id}"
                                };
                            }
                        }
                    }

                    // Save changes for the updated book quantities
                    if (_bookRepository.IsSaveChanges())
                    {
                        // Clear cart books
                        _cartRepository.ClearCartBook(order.OrderBooks.Select(c => c.BookId).ToList());

                        return new ResponseDTO()
                        {
                            Message = "Tạo thành công",
                            Data = orderId // Return the OrderId in response
                        };
                    }

                    return new ResponseDTO()
                    {
                        Code = 400,
                        Message = "Cập nhật số lượng sách thất bại"
                    };
                }

                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Tạo thất bại"
                };
            }

            return new ResponseDTO
            {
                Code = 404,
                Message = "User không tồn tại"
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
        
        public ResponseDTO GetSelfOrders(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var userId = _userAccessor.GetCurrentUserId();
            if (userId != null) return GetOrderByUser((int)userId, page, pageSize, key, sortBy);
            return new ResponseDTO()
            {
                Code = 400,
                Message = "User không tồn tại"
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
