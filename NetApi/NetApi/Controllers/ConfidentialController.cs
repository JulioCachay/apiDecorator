using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace NetApi.Controllers;

public class ConfidentialController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ConfidentialController> _logger;

    public ConfidentialController(
        IHttpClientFactory httpClientFactory,
        ILogger<ConfidentialController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet]
    [Route("confidential")]
    public async Task<ActionResult<ConfidentialResponse>> Confidential()
    {
        var token = Request.Headers.Authorization[0]!.Split(' ')[1];

        _logger.LogInformation("Received jwt: " + token);
        var client = _httpClientFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetFromJsonAsync<ConfidentialResponse>(
            "http://localhost:5000/confidential");
        
        _logger.LogInformation("Response: " + JsonSerializer.Serialize(response));

        return Ok(response);
    }
        
        
}

public class ConfidentialResponse
{
    public string Message { get; set; } = "";
}