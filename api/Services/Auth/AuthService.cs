using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using api.Config;
using api.DTOs.Auth;
using api.DTOs.Usuario;
using api.Models;
using api.Repositories;
using api.Services.Cloudinary;
using Microsoft.IdentityModel.Tokens;

namespace api.Services.Auth;

public class AuthService(
  IRepository<Models.Usuario> usuarioRepository,
  IConfiguration configuration,
  CloudinaryService cloudinaryService,
  ILogger<AuthService> logger
)
{
  private readonly int _hoursViableToken = 72;

  private string HashPassword(string password)
  {
    try
    {
      using var sha256 = SHA256.Create();
      var bytes = Encoding.UTF8.GetBytes(password);
      var hash = sha256.ComputeHash(bytes);
      return Convert.ToBase64String(hash);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Error hashing password");
      throw new InvalidOperationException("Error al procesar el hash", ex);
    }
  }

  public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
  {
    try
    {
      // Validate input
      if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
      {
        logger.LogWarning("Password o Email vacíos en el intento de inicio de sesión");
        return null;
      }

      var passwordHash = HashPassword(request.Password);
      
      // Include roles navigation properties
      var userFind = await usuarioRepository.FindWithIncludesAsync(
        u => u.Email == request.Email && u.Password == passwordHash,
        u => u.UsuariosRoles,
        u => u.UsuariosRoles.Select(ur => ur.IdRolNavigation)
      );
      
      var getUser = userFind?.FirstOrDefault();
      
      if (getUser == null) 
      {
        logger.LogWarning("Error al encontrar su cuenta, reintente: {Email}", request.Email);
        return null;
      }

      // Check account status
      if (getUser.EstadoCuenta != "Activo")
      {
        return null;
      }
      
      var token = GenerateJwtToken(getUser);
      
      logger.LogInformation("Successful login for user: {Email}", request.Email);
      
      return new AuthResponseDto
      {
        Token = token,
        Usuario = new UsuarioDto()
        {
          Id = getUser.Id,
          FotoPerfil = getUser.FotoPerfil,
          NombreUsuario = getUser.NombreUsuario,
          Email = getUser.Email,
          FechaNacimiento = getUser.FechaNacimiento,
          Genero = getUser.Genero,
          EstadoCuenta = getUser.EstadoCuenta
        }
      };
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Error during login for email: {Email}", request.Email);
      throw new InvalidOperationException("Login failed due to internal error", ex);
    }
  }

  public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
  {
    try
    {
      // Validate input
      if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
      {
        logger.LogWarning("Registration attempt with invalid data");
        return null;
      }

      // Check if user already exists
      var existingUsers = await usuarioRepository.FindAsync(u => u.Email == request.Email || u.NombreUsuario == request.NombreUsuario);
      if (existingUsers.Any())
      {
        logger.LogWarning("Registration failed - user already exists: {Email}", request.Email);
        return null;
      }

      // Validate password strength
      if (!IsValidPassword(request.Password))
      {
        logger.LogWarning("Registration failed - weak password for: {Email}", request.Email);
        return null;
      }

      // Parse BirthDate robustly (accept nullable DateOnly)
      DateOnly? birthDate = null;
      if (request.FechaNacimiento != null) birthDate = request.FechaNacimiento;

      // Handle FotoPerfil: use uploaded image, or fallback to null if not present
      string? imageUrl = null;
      if (request.FotoPerfil != null)
      {
        try
        {
          var uploadResult = await cloudinaryService.UploadImageAsync(request.FotoPerfil);
          imageUrl = uploadResult?.SecureUrl?.ToString();
        }
        catch (Exception ex)
        {
          logger.LogError(ex, "Error uploading profile image for: {Email}", request.Email);
          // Continue without image rather than failing registration
        }
      }

      var usuario = new Models.Usuario
      {
        Id = Guid.NewGuid(),
        NombreUsuario = request.NombreUsuario,
        Email = request.Email.ToLowerInvariant(),
        Password = HashPassword(request.Password),
        Genero = ValidateGenero(request.Genero),
        FechaNacimiento = ValidateFechaNacimiento(birthDate),
        FotoPerfil = imageUrl,
        CreateAt = DateTime.UtcNow,
        UpdateAt = DateTime.UtcNow,
        EstadoCuenta = "Activo"
      };

      await usuarioRepository.AddAsync(usuario);
      await usuarioRepository.SaveChangesAsync();

      // Reload user with roles after creation (trigger should assign default role)
      var createdUser = await usuarioRepository.GetByIdWithIncludesAsync(
        usuario.Id,
        u => u.UsuariosRoles,
        u => u.UsuariosRoles.Select(ur => ur.IdRolNavigation)
      );

      if (createdUser == null)
      {
        logger.LogError("Failed to retrieve created user: {Email}", request.Email);
        throw new InvalidOperationException("User creation failed");
      }

      var token = GenerateJwtToken(createdUser);
      
      logger.LogInformation("Successful registration for user: {Email}", request.Email);
      
      return new AuthResponseDto
      {
        Token = token, 
        Usuario = new UsuarioDto()
        {
          Id = createdUser.Id,
          FotoPerfil = createdUser.FotoPerfil,
          NombreUsuario = createdUser.NombreUsuario,
          Email = createdUser.Email,
          FechaNacimiento = createdUser.FechaNacimiento,
          Genero = createdUser.Genero,
          EstadoCuenta = createdUser.EstadoCuenta,
        }
      };
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
      throw new InvalidOperationException("Registration failed due to internal error", ex);
    }
  }

  private bool IsValidPassword(string password)
  {
    if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
      return false;

    // Add more password validation rules as needed
    return password.Any(char.IsDigit) && 
           password.Any(char.IsLetter) && 
           password.Any(char.IsUpper) && 
           password.Any(char.IsLower);
  }

  private string ValidateGenero(string? genero)
  {
    if (string.IsNullOrEmpty(genero))
      return "O";

    return genero.ToUpperInvariant() switch
    {
      "M" or "MASCULINO" or "MALE" => "M",
      "F" or "FEMENINO" or "FEMALE" => "F",
      _ => "O"
    };
  }

  // Helper to validate FechaNacimiento
  private DateOnly? ValidateFechaNacimiento(DateOnly? fechaNacimiento)
  {
    if (fechaNacimiento == null)
      return null;

    var minDate = new DateOnly(1900, 1, 1);
    var maxDate = DateOnly.FromDateTime(DateTime.UtcNow);

    if (fechaNacimiento < minDate || fechaNacimiento > maxDate)
      return null;

    return fechaNacimiento;
  }

  public string GenerateJwtToken(Models.Usuario usuario)
  {
    try
    {
      var jwtSettings = configuration.GetSection("Jwt").Get<JwtSesttings>();
      
      if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Key))
      {
        logger.LogError("JWT settings not configured properly");
        throw new InvalidOperationException("JWT configuration is missing");
      }

      var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
      var credentials = new SigningCredentials(jwtKey, SecurityAlgorithms.HmacSha256);

      // Get active roles only
      var roles = usuario.UsuariosRoles
        ?.Where(ur => ur.Activo && ur.IdRolNavigation != null)
        .Select(ur => ur.IdRolNavigation.Nombre)
        .ToList() ?? new List<string>();

      // Assign default role if no roles found
      var claims = new List<Claim>
      {
        new(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
        new(JwtRegisteredClaimNames.Email, usuario.Email),
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new("nombreUsuario", usuario.NombreUsuario),
        new("role", string.Join(",", roles))
      };

      var token = new JwtSecurityToken(
        issuer: jwtSettings.Issuer,
        audience: jwtSettings.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(_hoursViableToken),
        signingCredentials: credentials
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Error al generar el Token: {UserId}", usuario.Id);
      throw new InvalidOperationException("Error al generar el Token", ex);
    }
  }
}