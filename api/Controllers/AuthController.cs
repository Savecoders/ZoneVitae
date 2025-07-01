using api.DTOs.Auth;
using api.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto request)
    {
        var result = await authService.LoginAsync(request);
        if (result == null) return Unauthorized();
        return Ok(result);
    }

    [HttpPost("signup")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto request)
    {
        var result = await authService.RegisterAsync(request);
        if (result == null) return BadRequest("El usuario ya existe");
        return Ok(result);
    }
}