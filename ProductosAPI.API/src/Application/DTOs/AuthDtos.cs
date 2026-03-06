namespace ProductosAPI.API.src.Application.DTOs;

public record LoginDto(string Username, string Password);
public record RegisterDto(string Username, string Password);
public record AuthResponseDto(string AccessToken, string Username);