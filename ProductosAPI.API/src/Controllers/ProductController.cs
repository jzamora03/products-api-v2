using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductosAPI.API.src.Application.DTOs;
using ProductosAPI.API.src.Application.Services;

namespace ProductosAPI.API.Controllers;

[ApiController]
[Route("Product")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly ProductService _svc;
    public ProductController(ProductService svc) => _svc = svc;

    [HttpGet] public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto f) => Ok(await _svc.GetAllAsync(f));

    [HttpGet("{id}")] public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _svc.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost] public async Task<IActionResult> Create(CreateProductDto dto)
    {
        var (result, error) = await _svc.CreateAsync(dto);
        if (error != null) return BadRequest(new { message = error });
        return CreatedAtAction(nameof(GetById), new { id = result!.Id }, result);
    }

    [HttpPost("bulk")] public async Task<IActionResult> BulkCreate(BulkCreateProductDto dto)
    {
        try
        {
            var (inserted, message) = await _svc.BulkCreateAsync(dto);
            return Ok(new { inserted, message });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}")] public async Task<IActionResult> Update(Guid id, UpdateProductDto dto)
    {
        var (result, error) = await _svc.UpdateAsync(id, dto);
        if (error == "Not found") return NotFound();
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpDelete("{id}")] public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _svc.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}