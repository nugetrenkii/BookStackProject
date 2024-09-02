using BookStack.Entities;
using BookStack.Utilities;

namespace BookStack.Persistence;

public static class DataSeeder
{
    public static async Task SeedData(this DataContext dbContext)
    {
        await dbContext.SeedRoles();
        await dbContext.SeedUsers();
    }

    private static async Task SeedRoles(this DataContext dbContext)
    {
        if (!dbContext.Roles.Any())
        {
            await dbContext.Roles.AddRangeAsync(new Role
            {
                Name = "admin"
            }, new Role
            {
                Name = "user"
            });
            await dbContext.SaveChangesAsync();
        }
    }
    
    private static async Task SeedCarts(this DataContext dbContext)
    {
        if (!dbContext.Carts.Any())
        {
            await dbContext.Carts.AddRangeAsync(new Cart
            {
                Id = 1
            }, new Cart
            {
                Id = 2
            });
            await dbContext.SaveChangesAsync();
        }
    }

    private static async Task SeedUsers(this DataContext dbContext)
    {
        if (!dbContext.Users.Any())
        {
            const string defaultPassword = "1234@Abcd";
            PasswordHelper.CreatePasswordHash(defaultPassword, out var passwordHash, out var passwordSalt);
            await dbContext.Users.AddRangeAsync(new User
            {
                Username = "admin",
                FirstName = "Admin",
                LastName = string.Empty,
                Email = "admin@test.com",
                CartId = 1,
                PasswordSalt = passwordSalt,
                PasswordHash = passwordHash,
                RoleId = dbContext.Roles.First(r => r.Name == "admin").Id
            }, new User
            {
                Username = "user",
                FirstName = "User",
                LastName = string.Empty,
                Email = "user@test.com",
                CartId = 2,
                PasswordSalt = passwordSalt,
                PasswordHash = passwordHash,
                RoleId = dbContext.Roles.First(r => r.Name == "user").Id
            });
            await dbContext.SaveChangesAsync();
        }
    }
}