using System.ComponentModel.DataAnnotations;

namespace BookStack.Entities
{
    public class Quantity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int Count { get; set; }
        public virtual List<Order> Orders { get; set; } = new List<Order>();
        public virtual List<Cart> Carts { get; set; } = new List<Cart>();
    }
}
