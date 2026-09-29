using Microsoft.EntityFrameworkCore;
using StoreTrae.Api.Models;

namespace StoreTrae.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Product>().ToTable("products");
        modelBuilder.Entity<Order>().ToTable("orders");
        modelBuilder.Entity<OrderItem>().ToTable("order_items");

        modelBuilder.Entity<User>().Property(u => u.PasswordHash).HasColumnName("password_hash");
        modelBuilder.Entity<User>().Property(u => u.CreatedAt).HasColumnName("created_at");
        modelBuilder.Entity<User>().Property(u => u.UpdatedAt).HasColumnName("updated_at");
        modelBuilder.Entity<User>().Property(u => u.Role).HasColumnName("role");

        modelBuilder.Entity<Product>().Property(p => p.ImageUrl).HasColumnName("image_url");
        modelBuilder.Entity<Product>().Property(p => p.StockCount).HasColumnName("stock_count");
        modelBuilder.Entity<Product>().Property(p => p.CreatedAt).HasColumnName("created_at");
        modelBuilder.Entity<Product>().Property(p => p.UpdatedAt).HasColumnName("updated_at");

        modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnName("total_amount");
        modelBuilder.Entity<Order>().Property(o => o.CustomerName).HasColumnName("customer_name");
        modelBuilder.Entity<Order>().Property(o => o.CustomerEmail).HasColumnName("customer_email");
        modelBuilder.Entity<Order>().Property(o => o.CustomerPhone).HasColumnName("customer_phone");
        modelBuilder.Entity<Order>().Property(o => o.ShippingAddress).HasColumnName("shipping_address");
        modelBuilder.Entity<Order>().Property(o => o.CreatedAt).HasColumnName("created_at");
        modelBuilder.Entity<Order>().Property(o => o.UpdatedAt).HasColumnName("updated_at");
        modelBuilder.Entity<Order>().Property(o => o.Status).HasColumnName("status");

        modelBuilder.Entity<OrderItem>().Property(oi => oi.OrderId).HasColumnName("order_id");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.ProductId).HasColumnName("product_id");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.ProductTitle).HasColumnName("product_title");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.PriceAtPurchase).HasColumnName("price_at_purchase");

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Category);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.PriceAtPurchase)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

    }
}
