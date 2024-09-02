using BookStack.DTOs.Response;

namespace BookStack.Services.VNPayService
{
    public interface IVNPayService
    {
        Task<ResponseDTO> CreateUrlPayment(int orderId, double total);
        Task<ResponseDTO> ReturnPayment(IQueryCollection vnpayData);
    }
}
