using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
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
  CloudinaryService cloudinaryService
)
{
  private readonly int _hoursViableToken = 72;

  private string HashPassword(string password)
  {
    using var sha256 = SHA256.Create();
    var bytes = Encoding.UTF8.GetBytes(password);
    var hash = sha256.ComputeHash(bytes);
    // Convert the byte array to a Base64 string for storage
    return Convert.ToBase64String(hash);
  }

  public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
  {
    var user = await usuarioRepository.GetAllAsync();
    var passwordHash = HashPassword(request.Password);
    var usuario = user.FirstOrDefault(u => u.Email == request.Email && u.Password == passwordHash);
    if (usuario == null) return null;
    var token = GenerateJwtToken(usuario);
    return new AuthResponseDto
    {
      Token = token,
      Usuario = new UsuarioDto()
      {
        Id = usuario.Id,
        FotoPerfil = usuario.FotoPerfil,
        NombreUsuario = usuario.NombreUsuario,
        Email = usuario.Email,
        FechaNacimiento = usuario.FechaNacimiento,
        Genero = usuario.Genero,
        EstadoCuenta = usuario.EstadoCuenta
      }
    };
  }

  public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
  {
    var user = (await usuarioRepository.GetAllAsync()).FirstOrDefault(u => u.Email == request.Email);
    if (user != null) return null;

    // Parse BirthDate robustly (accept nullable DateOnly)
    DateOnly? birthDate = null;
    if (request.FechaNacimiento != null) birthDate = request.FechaNacimiento;

    // Handle FotoPerfil: use uploaded image, or fallback to null if not present
    string? imageUrl = null;
    if (request.FotoPerfil != null)
    {
      var uploadResult = await cloudinaryService.UploadImageAsync(request.FotoPerfil);
      imageUrl = uploadResult?.SecureUrl?.ToString();
    }

    var usuario = new Models.Usuario
    {
      Id = Guid.NewGuid(),
      NombreUsuario = request.NombreUsuario,
      Email = request.Email,
      Password = HashPassword(request.Password),
      Genero = !string.IsNullOrEmpty(request.Genero) &&
               (request.Genero == "M" || request.Genero == "F" || request.Genero == "O")
        ? request.Genero
        : "O",
      FechaNacimiento = ValidateFechaNacimiento(birthDate),
      FotoPerfil = imageUrl,
      CreateAt = DateTime.UtcNow,
      UpdateAt = DateTime.UtcNow,
      EstadoCuenta = "Activo"
    };
    await usuarioRepository.AddAsync(usuario);
    await usuarioRepository.SaveChangesAsync();

    
    var token = GenerateJwtToken(usuario);
    return new AuthResponseDto
    {
      Token = token, 
      Usuario = new UsuarioDto()
      {
        Id = usuario.Id,
        FotoPerfil =  usuario.FotoPerfil,
        NombreUsuario = usuario.NombreUsuario,
        Email = usuario.Email,
        FechaNacimiento = usuario.FechaNacimiento,
        Genero = usuario.Genero,
        EstadoCuenta = usuario.EstadoCuenta,
      }
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

  // Public method that can be called from other services or controllers
  public string GenerateTokenForUser(Models.Usuario usuario)
  {
    return GenerateJwtToken(usuario);
  }

  private string GenerateJwtToken(Models.Usuario usuario)
  {
    var jwtSettings = configuration.GetSection("Jwt");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
    var creeds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var claims = new[]
    {
      new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
      new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
      new Claim("nombreUsuario", usuario.NombreUsuario)
    };
    var token = new JwtSecurityToken(
      jwtSettings["Issuer"],
      jwtSettings["Audience"],
      claims,
      expires: DateTime.UtcNow.AddHours(_hoursViableToken),
      signingCredentials: creeds
    );
    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}