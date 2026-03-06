using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ProductosAPI.API.src.Application.DTOs;

namespace ProductosAPI.API.src.Application.Services;

public class AuthService
{
    private readonly IConfiguration _config;
    private static readonly Dictionary<string, string> _users = new()
    {
        { "admin", BCrypt.Net.BCrypt.HashPassword("admin123") }
    };

    public AuthService(IConfiguration config) => _config = config;

    public AuthResponseDto? Login(LoginDto dto)
    {
        if (!_users.TryGetValue(dto.Username, out var hash)) return null;
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, hash)) return null;
        return new AuthResponseDto(GenerateToken(dto.Username), dto.Username);
    }

    public AuthResponseDto? Register(RegisterDto dto)
    {
        if (_users.ContainsKey(dto.Username)) return null;
        _users[dto.Username] = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        return new AuthResponseDto(GenerateToken(dto.Username), dto.Username);
    }

    private string GenerateToken(string username)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: new[] { new Claim(ClaimTypes.Name, username) },
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}