using Microsoft.AspNetCore.Mvc;
using ProductosAPI.API.src.Application.DTOs;
using ProductosAPI.API.src.Application.Services;

namespace ProductosAPI.API.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _svc;
    public AuthController(AuthService svc) => _svc = svc;

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var result = _svc.Login(dto);
        if (result == null) return Unauthorized(new { message = "Invalid credentials" });
        return Ok(result);
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var result = _svc.Register(dto);
        if (result == null) return BadRequest(new { message = "Username already exists" });
        return Ok(result);
    }
}