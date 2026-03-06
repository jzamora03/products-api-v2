namespace ProductosAPI.API.src.Application.DTOs;

public record CreateProductDto(
    string Name,
    Guid CategoryId,
    string? QuantityPerUnit,
    decimal UnitPrice = 0,
    int UnitsInStock = 0,
    int UnitsOnOrder = 0,
    int ReorderLevel = 0,
    bool Discontinued = false
);

public record UpdateProductDto(
    string? Name,
    Guid? CategoryId,
    string? QuantityPerUnit,
    decimal? UnitPrice,
    int? UnitsInStock,
    int? UnitsOnOrder,
    int? ReorderLevel,
    bool? Discontinued
);

public record BulkCreateProductDto(int Count, Guid CategoryId);

public record CategorySummaryDto(Guid Id, string Name, string? Picture);

public record ProductResponseDto(
    Guid Id,
    string Name,
    Guid CategoryId,
    CategorySummaryDto? Category,
    string? QuantityPerUnit,
    decimal UnitPrice,
    int UnitsInStock,
    int UnitsOnOrder,
    int ReorderLevel,
    bool Discontinued,
    DateTime CreatedAt
)
{
    public static ProductResponseDto FromEntity(Domain.Entities.Product p) =>
        new(p.Id, p.Name, p.CategoryId,
            p.Category == null ? null : new CategorySummaryDto(p.Category.Id, p.Category.Name, p.Category.Picture),
            p.QuantityPerUnit, p.UnitPrice, p.UnitsInStock, p.UnitsOnOrder, p.ReorderLevel, p.Discontinued, p.CreatedAt);
}

public record PaginatedProductsDto(
    IEnumerable<ProductResponseDto> Data,
    int Total,
    int Page,
    int Limit,
    int TotalPages
);

public record ProductFilterDto(
    int Page = 1,
    int Limit = 20,
    string? Search = null,
    Guid? CategoryId = null,
    bool? Discontinued = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string SortBy = "CreatedAt",
    string SortOrder = "DESC"
);