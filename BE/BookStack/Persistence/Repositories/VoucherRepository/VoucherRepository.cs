using BookStack.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStack.Persistence.Repositories.VoucherRepository;

public class VoucherRepository : IVoucherRepository
{
    private readonly DataContext _dataContext;

    public VoucherRepository(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    public void CreateVoucher(Voucher voucher)
    {
        _dataContext.Vouchers.Add(voucher);
    }
    
    public void DeleteVoucher(Voucher voucher)
    {
        _dataContext.Vouchers.Remove(voucher);
    }
    
    public Voucher GetVoucherById(int id)
    {
        return _dataContext.Vouchers
            .FirstOrDefault(v => v.Id == id) ?? throw new KeyNotFoundException();
    }
}