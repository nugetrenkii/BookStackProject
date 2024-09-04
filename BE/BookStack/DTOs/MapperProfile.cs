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
            CreateMap<UserDTO, Entities.User>();
            CreateMap<Entities.User, UserDTO>();

            CreateMap<RegisterUserDTO, Entities.User>();
            CreateMap<Entities.User, RegisterUserDTO>();

            CreateMap<CreateUserDTO, Entities.User>();
            CreateMap<Entities.User, CreateUserDTO>();

            CreateMap<UpdateUserDTO, Entities.User>();
            CreateMap<Entities.User, UpdateUserDTO>();

            CreateMap<AuthorDTO, Entities.Author>();
            CreateMap<Entities.Author, AuthorDTO>();

            CreateMap<PublisherDTO, Entities.Publisher>();
            CreateMap<Entities.Publisher, PublisherDTO>();

            CreateMap<AddressDTO, Entities.Address>();
            CreateMap<Entities.Address, AddressDTO>();

            CreateMap<CreateAddressDTO, Entities.Address>();
            CreateMap<Entities.Address, CreateAddressDTO>();

            CreateMap<UpdateAddressDTO, Entities.Address>();
            CreateMap<Entities.Address, UpdateAddressDTO>();

            CreateMap<TagDTO, Entities.Tag>();
            CreateMap<Entities.Tag, TagDTO>();

            CreateMap<ShippingModeDTO, Entities.ShippingMode>();
            CreateMap<Entities.ShippingMode, ShippingModeDTO>();

            CreateMap<BookDTO, Entities.Book>();
            CreateMap<Entities.Book, BookDTO>();

            CreateMap<CreateBookDTO, Entities.Book>();
            CreateMap<Entities.Book, CreateBookDTO>();

            CreateMap<UpdateBookDTO, Entities.Book>();
            CreateMap<Entities.Book, UpdateBookDTO>();

            CreateMap<QuantityDTO, Quantity>();
            CreateMap<Quantity, QuantityDTO>();

            CreateMap<OrderDTO, Entities.Order>();
            CreateMap<Entities.Order, OrderDTO>();

            CreateMap<CreateOrderDTO, Entities.Order>();
            CreateMap<Entities.Order, CreateOrderDTO>();

            CreateMap<UpdateOrderDTO, Entities.Order>();
            CreateMap<Entities.Order, UpdateOrderDTO>();

            CreateMap<CartDTO, Entities.Cart>();
            CreateMap<Entities.Cart, CartDTO>();

            CreateMap<RoleDTO, Entities.Role>();
            CreateMap<Entities.Role, RoleDTO>();

            CreateMap<RatingDTO, Rating>();
            CreateMap<Rating, RatingDTO>();

            CreateMap<CreateRatingDTO, Rating>();
            CreateMap<Rating, CreateRatingDTO>();

            CreateMap<CartBookDTO, Entities.CartBook>();
            CreateMap<Entities.CartBook, CartBookDTO>();

            CreateMap<Entities.OrderBook, OrderBookDTO>();
            CreateMap<OrderBookDTO, Entities.OrderBook>();

            //CreateMap<Book, CreateBookDTO>()
            //.ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));
            //
            //CreateMap<CreateBookDTO, Book>()
            //.ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));
        }
    }
}
