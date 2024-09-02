using System.ComponentModel.DataAnnotations;

namespace BookStack.Entities;

public class OrderSnapshot
{
    [Key]
    public int Id { get; set; }
    public string OrderStatus { get; set; } = "NEW";
    public string OrderPayMode { get; set; } = "CASH";
    [StringLength(255)]
    public string OrderDescription { get; set; } = "";
    public bool OrderIsDeleted { get; set; } = false;
    public DateTime Create { get; set; } = DateTime.Now;
    public DateTime Update { get; set; } = DateTime.Now;
    public int OrderUserId { get; set; }
    public int OrderShippingModeId { get; set; }
    public int OrderAddressId { get; set; }
    public int OrderId { get; set; }
    public virtual Order Order { get; set; }
    public List<OrderBook> OrderBooks { get; set; }
}