using AutoMapper;
using BookStack.DTOs.Address;
using BookStack.DTOs.Author;
using BookStack.DTOs.Book;
using BookStack.DTOs.Cart;
using BookStack.DTOs.CartBook;
using BookStack.DTOs.Order;
using BookStack.DTOs.OrderBook;
using BookStack.DTOs.Publisher;
using BookStack.DTOs.Rate;
using BookStack.DTOs.Role;
using BookStack.DTOs.ShippingMode;
using BookStack.DTOs.Tag;
using BookStack.DTOs.User;
using BookStack.Entities;

namespace BookStack.DTOs
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<UserDTO, Entities.User>().ReverseMap();

            CreateMap<RegisterUserDTO, Entities.User>().ReverseMap();

            CreateMap<CreateUserDTO, Entities.User>().ReverseMap();

            CreateMap<UpdateUserDTO, Entities.User>().ReverseMap();

            CreateMap<AuthorDTO, Entities.Author>().ReverseMap();

            CreateMap<PublisherDTO, Entities.Publisher>().ReverseMap();

            CreateMap<AddressDTO, Entities.Address>().ReverseMap();

            CreateMap<CreateAddressDTO, Entities.Address>().ReverseMap();

            CreateMap<SelfCreateAddressDTO, Entities.Address>().ReverseMap();

            CreateMap<UpdateAddressDTO, Entities.Address>().ReverseMap();

            CreateMap<TagDTO, Entities.Tag>().ReverseMap();

            CreateMap<ShippingModeDTO, Entities.ShippingMode>().ReverseMap();

            CreateMap<BookDTO, Entities.Book>().ReverseMap();

            CreateMap<CreateBookDTO, Entities.Book>().ReverseMap();

            CreateMap<UpdateBookDTO, Entities.Book>().ReverseMap();

            CreateMap<QuantityDTO, Quantity>().ReverseMap();

            CreateMap<OrderDTO, Entities.Order>().ReverseMap();

            CreateMap<CreateOrderDTO, Entities.Order>().ReverseMap();

            CreateMap<SelfCreateOrderDTO, Entities.Order>().ReverseMap();

            CreateMap<UpdateOrderDTO, Entities.Order>().ReverseMap();

            CreateMap<CartDTO, Entities.Cart>().ReverseMap();

            CreateMap<RoleDTO, Entities.Role>().ReverseMap();

            CreateMap<RatingDTO, Rating>().ReverseMap();

            CreateMap<CreateRatingDTO, Rating>().ReverseMap();

            CreateMap<SelfCreateRatingDTO, Rating>().ReverseMap();

            CreateMap<CartBookDTO, Entities.CartBook>().ReverseMap();

            CreateMap<Entities.OrderBook, OrderBookDTO>().ReverseMap();

            //CreateMap<Book, CreateBookDTO>()
            //.ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));
            //
            //CreateMap<CreateBookDTO, Book>()
            //.ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));
        }
    }
}
