using BookStack.DTOs.Address;
using BookStack.DTOs.Book;
using BookStack.DTOs.ShippingMode;
using BookStack.DTOs.User;
using System.ComponentModel.DataAnnotations;

namespace BookStack.DTOs.Order
{
    public class CreateOrderDTO
    {
        public string Type { get; set; }
        public string Status { get; set; }
        public string PayMode { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public int ShippingModeId { get; set; }
        public int AddressId { get; set; }
        public List<int> QuantitieCounts { get; set; }
        public virtual List<int> BookIds { get; set; }
    }
}
