namespace ProductosAPI.API.src.Application.DTOs;

public record CreateCategoryDto(string Name, string? Description, string? Picture);
public record UpdateCategoryDto(string? Name, string? Description, string? Picture);
public record CategoryResponseDto(Guid Id, string Name, string? Description, string? Picture, DateTime CreatedAt)
{
    public static CategoryResponseDto FromEntity(Domain.Entities.Category c) =>
        new(c.Id, c.Name, c.Description, c.Picture, c.CreatedAt);
}