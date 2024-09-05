namespace BookStack.Entities;

public class Voucher
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Type { get; set; } //PERCENTAGE, FIXED
    public double Amount { get; set; }
    public bool IsDeleted { get; set; }
    public int Count { get; set; }
}