using BookStack.Entities;
using BookStack.Services.AddressService;
using BookStack.Services.AuthorService;
using BookStack.Services.AuthService;
using BookStack.Services.BookService;
using BookStack.Services.CartService;
using BookStack.Services.OrderService;
using BookStack.Services.PublisherService;
using BookStack.Services.RatingService;
using BookStack.Services.ShippingModeService;
using BookStack.Services.StatisticalService;
using BookStack.Services.TagService;
using BookStack.Services.TokenService;
using BookStack.Services.UserService;
using BookStack.Services.VNPayService;

namespace BookStack.Extensions;

public static class ServiceExtension
{
    public static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAddressService, AddressService>();
        services.AddScoped<IAuthorService, AuthorService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IBookService, BookService>();
        services.AddScoped<ICartService, CartService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IPublisherService, PublisherService>();
        services.AddScoped<IRatingService, RatingService>();
        services.AddScoped<IShippingModeService, ShippingModeService>();
        services.AddScoped<IStatisticalService, StatisticalService>();
        services.AddScoped<ITagService, TagService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IVNPayService, VNPayService>();
    }
}