using Microsoft.EntityFrameworkCore;
using ProductosAPI.API.src.Application.DTOs;
using ProductosAPI.API.src.Application.Services;
using ProductosAPI.API.src.Domain.Entities;
using ProductosAPI.API.src.Infrastructure.Data;

namespace ProductosAPI.Tests;

public class ProductServiceTests
{
    private AppDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(opts);
    }

    private Category SeedCategory(AppDbContext db)
    {
        var cat = new Category { Id = Guid.NewGuid(), Name = "SERVIDORES" };
        db.Categories.Add(cat);
        db.SaveChanges();
        return cat;
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        var db = CreateDb();
        var svc = new ProductService(db);
        var result = await svc.GetByIdAsync(Guid.NewGuid());
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_ReturnsError_WhenCategoryNotFound()
    {
        var db = CreateDb();
        var svc = new ProductService(db);
        var dto = new CreateProductDto("Test", Guid.NewGuid(), "1 unit", 100, 10, 0, 5, false);
        var (result, error) = await svc.CreateAsync(dto);
        Assert.Null(result);
        Assert.Equal("Category not found", error);
    }

    [Fact]
    public async Task CreateAsync_ReturnsProduct_WhenValid()
    {
        var db = CreateDb();
        var cat = SeedCategory(db);
        var svc = new ProductService(db);
        var dto = new CreateProductDto("PowerEdge 9000", cat.Id, "1 unit", 999.99m, 50, 5, 10, false);
        var (result, error) = await svc.CreateAsync(dto);
        Assert.NotNull(result);
        Assert.Null(error);
        Assert.Equal("PowerEdge 9000", result.Name);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
    {
        var db = CreateDb();
        var svc = new ProductService(db);
        var result = await svc.DeleteAsync(Guid.NewGuid());
        Assert.False(result);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenExists()
    {
        var db = CreateDb();
        var cat = SeedCategory(db);
        var svc = new ProductService(db);
        var dto = new CreateProductDto("To Delete", cat.Id, "1 unit", 100, 1, 0, 1, false);
        var (created, _) = await svc.CreateAsync(dto);
        var result = await svc.DeleteAsync(created!.Id);
        Assert.True(result);
    }

    [Fact]
    public async Task BulkCreateAsync_ThrowsException_WhenCategoryNotFound()
    {
        var db = CreateDb();
        var svc = new ProductService(db);
        var dto = new BulkCreateProductDto(10, Guid.NewGuid());
        await Assert.ThrowsAsync<Exception>(() => svc.BulkCreateAsync(dto));
    }

    [Fact]
    public async Task BulkCreateAsync_InsertsCorrectCount()
    {
        var db = CreateDb();
        var cat = SeedCategory(db);
        var svc = new ProductService(db);
        var dto = new BulkCreateProductDto(50, cat.Id);
        var (inserted, _) = await svc.BulkCreateAsync(dto);
        Assert.Equal(50, inserted);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsPaginated()
    {
        var db = CreateDb();
        var cat = SeedCategory(db);
        var svc = new ProductService(db);
        await svc.BulkCreateAsync(new BulkCreateProductDto(25, cat.Id));
        var filter = new ProductFilterDto { Page = 1, Limit = 10 };
        var result = await svc.GetAllAsync(filter);
        Assert.Equal(25, result.Total);
        Assert.Equal(10, result.Data.Count());
    }
}