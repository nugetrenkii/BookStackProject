using BookStack.DTOs.Book;
using System.ComponentModel.DataAnnotations;
using BookStack.DTOs.Address;
using BookStack.DTOs.OrderBook;
using BookStack.DTOs.ShippingMode;
using BookStack.DTOs.User;

namespace BookStack.DTOs.Order
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public string PayMode { get; set; }
        public string Description { get; set; }
        public double TotalPrice { get; set; }
        public bool IsDeleted { get; set; }
        public virtual UserDTO User { get; set; }
        public virtual ShippingModeDTO ShippingMode { get; set; }
        public virtual AddressDTO Address { get; set; }
        public virtual List<OrderBookDTO> OrderBooks { get; set; }
    }
}
