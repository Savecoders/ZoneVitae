using api.DTOs.Auth;
using api.DTOs.Common;
using api.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginRequestDto request)
    {
        var result = await authService.LoginAsync(request);

        if (!result.Success)
        {
            return result.ErrorType switch
            {
                AuthErrorType.InvalidCredentials => Unauthorized(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = result.ErrorMessage!,
                    Data = default
                }),
                AuthErrorType.AccountInactive => StatusCode(403, new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = result.ErrorMessage!,
                    Data = default
                }),
                _ => BadRequest(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = result.ErrorMessage!,
                    Data = default
                })
            };
        }

        return Ok(new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Message = "Inicio de sesión exitoso",
            Data = result.Data!
        });
    }

    [HttpPost("signup")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromForm] RegisterRequestDto request)
    {
        var result = await authService.RegisterAsync(request);

        if (!result.Success)
        {
            return result.ErrorType switch
            {
                AuthErrorType.EmailAlreadyExists => Conflict(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = result.ErrorMessage!,
                    Data = default
                }),
                AuthErrorType.WeakPassword => BadRequest(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = result.ErrorMessage!,
                    Data = default
                }),
                AuthErrorType.UsernameAlreadyExists => Conflict(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = result.ErrorMessage!,
                    Data = default
                }),
                _ => BadRequest(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = result.ErrorMessage!,
                    Data = default
                })
            };
        }

        return Created(string.Empty, new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Message = "Registro exitoso",
            Data = result.Data!
        });
    }
}
