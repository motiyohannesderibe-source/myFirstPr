using System.ComponentModel.DataAnnotations;

namespace StoreTrae.Api.Models.DTOs;

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductTitle { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal PriceAtPurchase { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class PlaceOrderRequestDto
{
    [Required]
    public List<OrderItemDto> Items { get; set; } = new();

    [Required]
    [Range(0, double.MaxValue)]
    public decimal TotalAmount { get; set; }

    [Required]
    [MaxLength(150)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    [Phone]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string ShippingAddress { get; set; } = string.Empty;
}

public class SalesReportDto
{
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public int ItemsSold { get; set; }
    public List<OrderDto> RecentOrders { get; set; } = new();
}
