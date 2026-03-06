using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace ProductosAPI.Tests;

public class ProductsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProductsIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_WithoutToken_Returns401()
    {
        var response = await _client.GetAsync("/Product");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

   [Fact]
    public async Task Login_WithInvalidCredentials_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/auth/login", new
        {
            username = "noexiste",
            password = "wrongpassword"
        });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}