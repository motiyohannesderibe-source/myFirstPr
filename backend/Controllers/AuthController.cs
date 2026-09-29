using Microsoft.AspNetCore.Mvc;
using Npgsql;
using StoreTrae.Api.Models.DTOs;
using StoreTrae.Api.Services;

namespace StoreTrae.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponseDto))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        LoginResponseDto? response;
        try
        {
            response = await _authService.LoginAsync(request);
        }
        catch (NpgsqlException)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                message = "Database unavailable. Start PostgreSQL on localhost:5432 and try again."
            });
        }

        if (response == null)
            return Unauthorized(new { message = "Invalid username or password" });

        return Ok(response);
    }
}
