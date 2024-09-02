﻿using BookStack.DTOs.Order;
using BookStack.DTOs.Response;

namespace BookStack.Services.OrderService
{
    public interface IOrderService
    {
        ResponseDTO GetOrders(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
        ResponseDTO GetOrderById(int id);
        ResponseDTO UpdateOrder(int id, UpdateOrderDTO updateOrderDTO);
        ResponseDTO DeleteOrder(int id);
        ResponseDTO CreateOrder(CreateOrderDTO createOrderDTO);
        ResponseDTO GetOrderByUser(int userId, int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
    }
}
