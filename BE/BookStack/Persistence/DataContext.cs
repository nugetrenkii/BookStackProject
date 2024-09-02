using BookStack.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BookStack.Persistence
{
    public class DataContext : DbContext
    {
        public DataContext() { }
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<Entities.Address> Addresses { get; set; }
        public DbSet<ShippingMode> ShippingModes { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderBook> OrderBooks { get; set; }
        public DbSet<OrderSnapshot> OrderSnapshots { get; set; }
        public DbSet<Quantity> Quantities { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartBook> CartBooks { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrderSnapshot>()
                .Property(o => o.OrderBooks)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<OrderBook>>(v) ?? new List<OrderBook>());
            
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict); // or DeleteBehavior.NoAction
        }
        
        public override int SaveChanges()
        {
            CaptureOrderChanges();
            return base.SaveChanges();
        }
        
        private void CaptureOrderChanges()
        {
            var modifiedOrders = ChangeTracker.Entries<Order>()
                .Where(e => e.State is EntityState.Modified);

            foreach (var order in modifiedOrders)
            {
                var originalOrder = order.OriginalValues;
                var orderSnapshot = new OrderSnapshot
                {
                    OrderId = order.Entity.Id,
                    OrderStatus = originalOrder["Status"]?.ToString() ?? string.Empty,
                    OrderPayMode = originalOrder["PayMode"]?.ToString() ?? string.Empty,
                    OrderDescription = originalOrder["Description"]?.ToString() ?? string.Empty,
                    OrderIsDeleted = (bool)(originalOrder["IsDeleted"] ?? false),
                    OrderUserId = (int)(originalOrder["UserId"] ?? 0),
                    OrderShippingModeId = (int)(originalOrder["ShippingModeId"] ?? 0),
                    OrderAddressId = (int)(originalOrder["AddressId"] ?? 0),
                    OrderBooks = JsonConvert.DeserializeObject<List<OrderBook>>(originalOrder["OrderBooks"]?.ToString() ?? string.Empty) ?? new List<OrderBook>(),
                    Create = DateTime.Now,
                    Update = DateTime.Now
                };

                OrderSnapshots.Add(orderSnapshot);
            }
        }
    }
}
