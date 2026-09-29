using Microsoft.EntityFrameworkCore;
using StoreTrae.Api.Data;
using StoreTrae.Api.Models;
using StoreTrae.Api.Models.DTOs;

namespace StoreTrae.Api.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductRequestDto request);
    Task<ProductDto?> UpdateAsync(int id, UpdateProductRequestDto request);
    Task<bool> DeleteAsync(int id);
}

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        var products = await _context.Products
            .OrderByDescending(p => p.UpdatedAt)
            .ToListAsync();

        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        return product == null ? null : MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequestDto request)
    {
        var product = new Product
        {
            Title = request.Title,
            Description = request.Description,
            Price = request.Price,
            Category = request.Category,
            ImageUrl = request.ImageUrl,
            StockCount = request.StockCount,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductRequestDto request)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        if (!string.IsNullOrWhiteSpace(request.Title))
            product.Title = request.Title;

        if (request.Description != null)
            product.Description = request.Description;

        if (request.Price.HasValue)
            product.Price = request.Price.Value;

        if (!string.IsNullOrWhiteSpace(request.Category))
            product.Category = request.Category;

        if (request.ImageUrl != null)
            product.ImageUrl = request.ImageUrl;

        if (request.StockCount.HasValue)
            product.StockCount = request.StockCount.Value;

        product.UpdatedAt = DateTime.UtcNow;

        _context.Products.Update(product);
        await _context.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Title = product.Title,
            Description = product.Description,
            Price = product.Price,
            Category = product.Category,
            ImageUrl = product.ImageUrl,
            StockCount = product.StockCount,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}
