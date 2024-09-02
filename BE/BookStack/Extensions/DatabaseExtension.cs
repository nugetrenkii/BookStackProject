using BookStack.Persistence;
using BookStack.Persistence.Repositories.AddressRepository;
using BookStack.Persistence.Repositories.AuthorRepository;
using BookStack.Persistence.Repositories.BookRepository;
using BookStack.Persistence.Repositories.CartRepository;
using BookStack.Persistence.Repositories.OrderRepository;
using BookStack.Persistence.Repositories.PublisherRepository;
using BookStack.Persistence.Repositories.QuantityRepository;
using BookStack.Persistence.Repositories.RatingRepository;
using BookStack.Persistence.Repositories.ShippingModeRepository;
using BookStack.Persistence.Repositories.TagRepository;
using BookStack.Persistence.Repositories.UserRepository;
using Microsoft.EntityFrameworkCore;

namespace BookStack.Extensions;

public static class DatabaseExtensions
{
    public static async Task ApplyMigrations(this IApplicationBuilder app)
    {
        try
        {
            using var scope = app.ApplicationServices.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
            await dbContext.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            // Handle the exception, e.g., log the error
            Console.WriteLine($"An error occurred while applying migrations: {ex.Message}");
        }
    }

    public static async Task SeedData(this IApplicationBuilder app)
    {
        try
        {
            using var scope = app.ApplicationServices.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
            await dbContext.SeedData();
        }
        catch (Exception ex)
        {
            // Handle the exception, e.g., log the error
            Console.WriteLine($"An error occurred while seeding data: {ex.Message}");
        }
    }
    
    public static void AddRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAuthorRepository, AuthorRepository>();
        services.AddScoped<IPublisherRepository, PublisherRepository>();
        services.AddScoped<IAddressRepository, AddressRepository>();
        services.AddScoped<ITagRepository, TagRepository>();
        services.AddScoped<IShippingModeRepository, ShippingModeRepository>();
        services.AddScoped<IBookRepository, BookRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IQuantityRepository, QuantityRepository>();
        services.AddScoped<IRatingRepository, RatingRepository>();
        services.AddScoped<ICartRepository, CartRepository>();
    }
}