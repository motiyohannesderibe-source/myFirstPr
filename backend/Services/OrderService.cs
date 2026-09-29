using Microsoft.EntityFrameworkCore;
using StoreTrae.Api.Data;
using StoreTrae.Api.Models;
using StoreTrae.Api.Models.DTOs;

namespace StoreTrae.Api.Services;

public interface IOrderService
{
    Task<List<OrderDto>> GetAllAsync();
    Task<OrderDto?> GetByIdAsync(int id);
    Task<OrderDto> PlaceOrderAsync(PlaceOrderRequestDto request);
    Task<SalesReportDto> GetSalesReportAsync();
}

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order == null ? null : MapToDto(order);
    }

    public async Task<OrderDto> PlaceOrderAsync(PlaceOrderRequestDto request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var orderItems = new List<OrderItem>();
            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null && product.StockCount >= item.Quantity)
                {
                    product.StockCount -= item.Quantity;
                    product.UpdatedAt = DateTime.UtcNow;
                    _context.Products.Update(product);
                }

                orderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductTitle = item.ProductTitle,
                    Quantity = item.Quantity,
                    PriceAtPurchase = item.PriceAtPurchase
                });
            }

            var order = new Order
            {
                Items = orderItems,
                TotalAmount = request.TotalAmount,
                CustomerName = request.CustomerName,
                CustomerEmail = request.CustomerEmail,
                CustomerPhone = request.CustomerPhone,
                ShippingAddress = request.ShippingAddress,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return MapToDto(order);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<SalesReportDto> GetSalesReportAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Take(50)
            .ToListAsync();

        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .SumAsync(o => o.TotalAmount);
        var itemsSold = await _context.OrderItems
            .Where(oi => oi.Order != null && oi.Order.Status != OrderStatus.Cancelled)
            .SumAsync(oi => oi.Quantity);

        return new SalesReportDto
        {
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            ItemsSold = itemsSold,
            RecentOrders = orders.Take(10).Select(MapToDto).ToList()
        };
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            Items = order.Items.Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductTitle = i.ProductTitle,
                Quantity = i.Quantity,
                PriceAtPurchase = i.PriceAtPurchase
            }).ToList(),
            TotalAmount = order.TotalAmount,
            CustomerName = order.CustomerName,
            CustomerEmail = order.CustomerEmail,
            CustomerPhone = order.CustomerPhone,
            ShippingAddress = order.ShippingAddress,
            Status = order.Status.ToString().ToLower(),
            CreatedAt = order.CreatedAt
        };
    }
}
