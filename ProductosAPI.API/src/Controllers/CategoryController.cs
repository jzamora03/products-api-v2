using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductosAPI.API.src.Application.DTOs;
using ProductosAPI.API.src.Application.Services;

namespace ProductosAPI.API.Controllers;

[ApiController]
[Route("Category")]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly CategoryService _svc;
    public CategoryController(CategoryService svc) => _svc = svc;

    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await _svc.GetAllAsync());

    [HttpGet("{id}")] public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _svc.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost] public async Task<IActionResult> Create(CreateCategoryDto dto)
    {
        var (result, error) = await _svc.CreateAsync(dto);
        if (error != null) return BadRequest(new { message = error });
        return CreatedAtAction(nameof(GetById), new { id = result!.Id }, result);
    }

    [HttpPut("{id}")] public async Task<IActionResult> Update(Guid id, UpdateCategoryDto dto)
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