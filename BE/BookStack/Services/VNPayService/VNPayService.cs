﻿using BookStack.DTOs.Response;
using BookStack.DTOs.User;
using BookStack.Persistence.Repositories.OrderRepository;
using BookStack.Persistence.Repositories.UserRepository;

namespace BookStack.Services.VNPayService
{
    public class VNPayService : IVNPayService
    {
        //private readonly IPaymentRepository _paymentRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IUserRepository _userRepository;
        public VNPayService(/*IPaymentRepository paymentRepository, */IOrderRepository orderRepository, IUserRepository userRepository)
        {
            //_paymentRepository = paymentRepository;
            _orderRepository = orderRepository;
            _userRepository = userRepository;
        }
        public async Task<ResponseDTO> CreateUrlPayment(int orderId, double total)
        {
            var orderP = _orderRepository.GetOrderById(orderId);
            if (orderP == null)
            {
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Booking is not valid"
                };
            }

            var configBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");

            var configuration = configBuilder.Build();

            var urlPayment = "";
            ////Get Config Info
            string vnp_Returnurl = configuration.GetSection("VnPay:vnp_ReturnUrl").Value; //URL nhan ket qua tra ve 
            string vnp_Url = configuration.GetSection("VnPay:vnp_Url").Value; //URL thanh toan cua VNPAY 
            string vnp_TmnCode = configuration.GetSection("VnPay:vnp_TmnCode").Value; //Ma định danh merchant kết nối (Terminal Id)
            string vnp_HashSecret = configuration.GetSection("VnPay:vnp_HashSecret").Value;//Secret Key

            ////Build URL for VNPAY

            VnPayLibrary vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", (total * 100).ToString()); //Số tiền thanh toán. Số tiền không mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND (một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần (khử phần thập phân), sau đó gửi sang VNPAY là: 10000000
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", "192.168.1.7");
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", orderId.ToString());
            vnpay.AddRequestData("vnp_OrderType", "210000"); //default value: other
            vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
            vnpay.AddRequestData("vnp_TxnRef", DateTime.Now.Ticks.ToString()); // Mã tham chiếu của giao dịch tại hệ thống của merchant. Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày
            vnpay.AddRequestData("vnp_ExpireDate", DateTime.Now.AddMinutes(15).ToString("yyyyMMddHHmmss"));

            //Add Params of 2.1.0 Version
            //Billing

            urlPayment = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);

            return new ResponseDTO
            {
                Code = 200,
                Message = "Success",
                Data = urlPayment
            };

        }

        public async Task<ResponseDTO> ReturnPayment(IQueryCollection vnpayData)
        {
            var configBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");

            var configuration = configBuilder.Build();

            string vnp_HashSecret = configuration.GetSection("VnPay:vnp_HashSecret").Value;//Secret Key
            VnPayLibrary vnpay = new VnPayLibrary();

            foreach (var kvp in vnpayData)
            {
                //get all querystring Data
                if (!string.IsNullOrEmpty(kvp.Key) && kvp.Key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(kvp.Key, kvp.Value);
                }
            }

            //vnp_TxnRef: Ma don hang merchant gui VNPAY tai command=pay    
            //vnp_TransactionNo: Ma GD tai he thong VNPAY
            //vnp_ResponseCode:Response Code from VNPAY: 00: Thanh cong, Khac 00: Xem tai lieu
            //vnp_SecureHash: HmacSHA512 cua du lieu tra ve



            //long orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));


            // Lay du lieu DataPayment

            long vnpayTranId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            string vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            string vnp_TransactionStatus = vnpay.GetResponseData("vnp_TransactionStatus");
            String vnp_SecureHash = vnpayData.Where(kvp => kvp.Key == "vnp_SecureHash").FirstOrDefault().Value;
            String TerminalID = vnpayData.Where(kvp => kvp.Key == "vnp_TmnCode").FirstOrDefault().Value;
            double total = Convert.ToDouble(vnpay.GetResponseData("vnp_Amount")) / 100;
            int orderId = Convert.ToInt32(vnpayData.Where(kvp => kvp.Key == "vnp_OrderInfo").FirstOrDefault().Value);
            string paymentInfo = vnpayData.Where(kvp => kvp.Key == "vnp_OrderInfo").FirstOrDefault().Value;

            //ParseBookingInfo(paymentInfo, out orderId, out total);

            //long vnp_Amount = Convert.ToInt64(vnpay.GetResponseData("vnp_Amount")) / 100;
            String bankCode = vnpayData.Where(kvp => kvp.Key == "vnp_BankCode").FirstOrDefault().Value;

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, vnp_HashSecret);
            if (checkSignature)
            {
                if (vnp_ResponseCode == "00" && vnp_TransactionStatus == "00")
                {
                    //Thanh toan thanh cong

                    // Tao payment va cap nhat trang thai order

                    //var payment = new Payment();
                    //payment.orderId = orderId;
                    //payment.time = DateTime.Now;
                    //payment.total = total;
                    //payment.mode = bankCode;
                    //
                    var order = _orderRepository.GetOrderById(orderId);
                    order.Status = "PAY";
                    _orderRepository.UpdateOrder(order);
                    if (_orderRepository.IsSaveChanges())
                        //
                        //// Neu payment chua ton tai thi tao payment moi
                        //if (!(await _paymentRepository.IsPaymentOfBookingAlreadyExists(orderId)))
                        //{
                        //    await _paymentRepository.CreatePaymentAsync(payment);
                        //    await _paymentRepository.IsSaveChange();
                        //}

                        return new ResponseDTO
                        {
                            Code = 200,
                            Message = "Success",
                            Data = new
                            {
                                orderId = orderId,
                                VnpayTranId = vnpayTranId,
                                bankPayment = bankCode,
                                Amount = total
                            }
                        };
                    else
                        return new ResponseDTO()
                        {
                            Code = 400,
                            Message = "Failed"
                        };
                }
                else
                {
                    return new ResponseDTO
                    {
                        Code = 500,
                        Message = "An error occurred during processing.Error Code: " + vnp_ResponseCode,
                    };
                }
            }
            else
            {
                return new ResponseDTO
                {
                    Code = 500,
                    Message = "Invalid signature",
                };
            }
        }
    }
}
