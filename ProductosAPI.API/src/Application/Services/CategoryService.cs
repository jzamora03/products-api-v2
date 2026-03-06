using Microsoft.EntityFrameworkCore;
using ProductosAPI.API.src.Application.DTOs;
using ProductosAPI.API.src.Infrastructure.Data;

namespace ProductosAPI.API.src.Application.Services;

public class CategoryService
{
    private readonly AppDbContext _db;
    public CategoryService(AppDbContext db) => _db = db;

    public async Task<List<CategoryResponseDto>> GetAllAsync()
    {
        var cats = await _db.Categories.OrderByDescending(c => c.CreatedAt).ToListAsync();
        return cats.Select(CategoryResponseDto.FromEntity).ToList();
    }

    public async Task<CategoryResponseDto?> GetByIdAsync(Guid id)
    {
        var cat = await _db.Categories.FindAsync(id);
        return cat == null ? null : CategoryResponseDto.FromEntity(cat);
    }

    public async Task<(CategoryResponseDto? Result, string? Error)> CreateAsync(CreateCategoryDto dto)
    {
        if (await _db.Categories.AnyAsync(c => c.Name == dto.Name))
            return (null, "Category name already exists");
        var cat = new Domain.Entities.Category { Name = dto.Name, Description = dto.Description, Picture = dto.Picture };
        _db.Categories.Add(cat);
        await _db.SaveChangesAsync();
        return (CategoryResponseDto.FromEntity(cat), null);
    }

    public async Task<(CategoryResponseDto? Result, string? Error)> UpdateAsync(Guid id, UpdateCategoryDto dto)
    {
        var cat = await _db.Categories.FindAsync(id);
        if (cat == null) return (null, "Not found");
        if (dto.Name != null) cat.Name = dto.Name;
        if (dto.Description != null) cat.Description = dto.Description;
        if (dto.Picture != null) cat.Picture = dto.Picture;
        cat.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return (CategoryResponseDto.FromEntity(cat), null);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var cat = await _db.Categories.FindAsync(id);
        if (cat == null) return false;
        _db.Categories.Remove(cat);
        await _db.SaveChangesAsync();
        return true;
    }
}