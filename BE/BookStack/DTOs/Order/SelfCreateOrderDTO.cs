﻿namespace BookStack.DTOs.Order;

public class SelfCreateOrderDTO
{
    public string Type { get; set; }
    public string Status { get; set; }
    public string PayMode { get; set; }
    public string Description { get; set; }
    public int ShippingModeId { get; set; }
    public int AddressId { get; set; }
    public List<int> QuantitieCounts { get; set; }
    public virtual List<int> BookIds { get; set; }
}