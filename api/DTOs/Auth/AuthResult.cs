namespace api.DTOs.Auth;

public class AuthResult
{
    public bool Success { get; set; }
    public AuthResponseDto? Data { get; set; }
    public string? ErrorMessage { get; set; }
    public AuthErrorType? ErrorType { get; set; }

    public static AuthResult SuccessResult(AuthResponseDto data)
    {
        return new AuthResult { Success = true, Data = data };
    }

    public static AuthResult ErrorResult(string errorMessage, AuthErrorType errorType)
    {
        return new AuthResult { Success = false, ErrorMessage = errorMessage, ErrorType = errorType };
    }
}

public enum AuthErrorType
{
    InvalidCredentials,
    UserAlreadyExists,
    EmailAlreadyExists,
    UsernameAlreadyExists,
    WeakPassword,
    AccountInactive,
    ValidationError,
    InternalError
}
