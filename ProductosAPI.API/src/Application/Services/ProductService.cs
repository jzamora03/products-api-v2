using Microsoft.EntityFrameworkCore;
using ProductosAPI.API.src.Application.DTOs;
using ProductosAPI.API.src.Infrastructure.Data;

namespace ProductosAPI.API.src.Application.Services;

public class ProductService
{
    private readonly AppDbContext _db;
    private static readonly string[] Names = ["PowerEdge", "ProLiant", "CloudNode", "Xeon", "EPYC", "NVMe SSD", "Switch", "Firewall", "GPUServer"];
    private static readonly string[] Vendors = ["Dell", "HP", "IBM", "Cisco", "Lenovo", "Supermicro"];
    private static readonly string[] Units = ["1 unit", "2 pack", "5 pack", "rack unit"];

    public ProductService(AppDbContext db) => _db = db;

    public async Task<PaginatedProductsDto> GetAllAsync(ProductFilterDto f)
    {
        var q = _db.Products.Include(p => p.Category).AsQueryable();
        if (!string.IsNullOrEmpty(f.Search))
            q = q.Where(p => p.Name.ToLower().Contains(f.Search.ToLower()));
        if (f.CategoryId.HasValue) q = q.Where(p => p.CategoryId == f.CategoryId);
        if (f.Discontinued.HasValue) q = q.Where(p => p.Discontinued == f.Discontinued);
        if (f.MinPrice.HasValue) q = q.Where(p => p.UnitPrice >= f.MinPrice);
        if (f.MaxPrice.HasValue) q = q.Where(p => p.UnitPrice <= f.MaxPrice);

        q = f.SortBy?.ToLower() switch
        {
            "name" => f.SortOrder == "ASC" ? q.OrderBy(p => p.Name) : q.OrderByDescending(p => p.Name),
            "unitprice" => f.SortOrder == "ASC" ? q.OrderBy(p => p.UnitPrice) : q.OrderByDescending(p => p.UnitPrice),
            _ => f.SortOrder == "ASC" ? q.OrderBy(p => p.CreatedAt) : q.OrderByDescending(p => p.CreatedAt)
        };

        var total = await q.CountAsync();
        var data = await q.Skip((f.Page - 1) * f.Limit).Take(f.Limit).ToListAsync();
        return new PaginatedProductsDto(data.Select(ProductResponseDto.FromEntity), total, f.Page, f.Limit, (int)Math.Ceiling((double)total / f.Limit));
    }

    public async Task<ProductResponseDto?> GetByIdAsync(Guid id)
    {
        var p = await _db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        return p == null ? null : ProductResponseDto.FromEntity(p);
    }

    public async Task<(ProductResponseDto? Result, string? Error)> CreateAsync(CreateProductDto dto)
    {
        if (!await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return (null, "Category not found");
        var p = new Domain.Entities.Product
        {
            Name = dto.Name, CategoryId = dto.CategoryId, QuantityPerUnit = dto.QuantityPerUnit,
            UnitPrice = dto.UnitPrice, UnitsInStock = dto.UnitsInStock, UnitsOnOrder = dto.UnitsOnOrder,
            ReorderLevel = dto.ReorderLevel, Discontinued = dto.Discontinued
        };
        _db.Products.Add(p);
        await _db.SaveChangesAsync();
        var created = await _db.Products.Include(x => x.Category).FirstAsync(x => x.Id == p.Id);
        return (ProductResponseDto.FromEntity(created), null);
    }

    public async Task<(ProductResponseDto? Result, string? Error)> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        var p = await _db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return (null, "Not found");
        if (dto.CategoryId.HasValue && !await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return (null, "Category not found");
        if (dto.Name != null) p.Name = dto.Name;
        if (dto.CategoryId.HasValue) p.CategoryId = dto.CategoryId.Value;
        if (dto.QuantityPerUnit != null) p.QuantityPerUnit = dto.QuantityPerUnit;
        if (dto.UnitPrice.HasValue) p.UnitPrice = dto.UnitPrice.Value;
        if (dto.UnitsInStock.HasValue) p.UnitsInStock = dto.UnitsInStock.Value;
        if (dto.UnitsOnOrder.HasValue) p.UnitsOnOrder = dto.UnitsOnOrder.Value;
        if (dto.ReorderLevel.HasValue) p.ReorderLevel = dto.ReorderLevel.Value;
        if (dto.Discontinued.HasValue) p.Discontinued = dto.Discontinued.Value;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return (ProductResponseDto.FromEntity(p), null);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p == null) return false;
        _db.Products.Remove(p);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(int Inserted, string Message)> BulkCreateAsync(BulkCreateProductDto dto)
    {
        if (!await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            throw new Exception("Category not found");
        var rng = new Random();
        const int batchSize = 1000;
        var inserted = 0;
        for (var i = 0; i < dto.Count; i += batchSize)
        {
            var batch = Enumerable.Range(0, Math.Min(batchSize, dto.Count - i)).Select(_ => new Domain.Entities.Product
            {
                Name = $"{Vendors[rng.Next(Vendors.Length)]} {Names[rng.Next(Names.Length)]} {rng.Next(1000, 9999)}",
                CategoryId = dto.CategoryId,
                QuantityPerUnit = Units[rng.Next(Units.Length)],
                UnitPrice = Math.Round((decimal)(rng.NextDouble() * 9990 + 10), 2),
                UnitsInStock = rng.Next(0, 500),
                UnitsOnOrder = rng.Next(0, 50),
                ReorderLevel = rng.Next(1, 20),
                Discontinued = rng.Next(0, 10) == 0
            }).ToList();
            await _db.Products.AddRangeAsync(batch);
            await _db.SaveChangesAsync();
            inserted += batch.Count;
        }
        return (inserted, $"Successfully inserted {inserted} products");
    }
}