namespace BookStack.Entities;

public class UserVoucher
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public int VoucherId { get; set; }
    public virtual Voucher Voucher { get; set; }
}