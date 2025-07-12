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

    public async Task<AuthResult> LoginAsync(LoginRequestDto request)
    {
        try
        {
            var passwordHash = HashPassword(request.Password);

            var userFind = await usuarioRepository.FindWithIncludesAsync(
              u => u.Email == request.Email && u.Password == passwordHash,
              u => u.UsuariosRoles,
              u => u.UsuariosRoles.Select(ur => ur.IdRolNavigation)
            );

            var getUser = userFind?.FirstOrDefault();

            if (getUser == null)
            {
                logger.LogWarning("Invalid login attempt for email: {Email}", request.Email);
                return AuthResult.ErrorResult("Credenciales inválidas", AuthErrorType.InvalidCredentials);
            }

            if (getUser.EstadoCuenta != "Activo")
            {
                return AuthResult.ErrorResult("La cuenta está inactiva", AuthErrorType.AccountInactive);
            }

            var token = GenerateJwtToken(getUser);

            logger.LogInformation("Successful login for user: {Email}", request.Email);

            return AuthResult.SuccessResult(new AuthResponseDto
            {
                Token = token,
                Usuario = MapToUsuarioDto(getUser)
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during login for email: {Email}", request.Email);
            return AuthResult.ErrorResult("Error interno del servidor", AuthErrorType.InternalError);
        }
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequestDto request)
    {
        try
        {
            var existingUserByEmail = await usuarioRepository.FindAsync(u => u.Email == request.Email);
            if (existingUserByEmail.Any())
            {
                logger.LogWarning("Registration failed - email already exists: {Email}", request.Email);
                return AuthResult.ErrorResult("El email ya está registrado", AuthErrorType.EmailAlreadyExists);
            }

            var existingUserByUsername = await usuarioRepository.FindAsync(u => u.NombreUsuario == request.NombreUsuario);
            if (existingUserByUsername.Any())
            {
                logger.LogWarning("Registration failed - username already exists: {Username}", request.NombreUsuario);
                return AuthResult.ErrorResult("El nombre de usuario ya está en uso", AuthErrorType.UsernameAlreadyExists);
            }

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
                }
            }

            // Parse date string to DateOnly if provided
            DateOnly? fechaNacimiento = null;
            if (!string.IsNullOrEmpty(request.FechaNacimiento))
            {
                if (DateOnly.TryParse(request.FechaNacimiento, out var parsedDate))
                {
                    fechaNacimiento = parsedDate;
                }
            }

            var usuario = new Models.Usuario
            {
                Id = Guid.NewGuid(),
                NombreUsuario = request.NombreUsuario,
                Email = request.Email.ToLowerInvariant(),
                Password = HashPassword(request.Password),
                Genero = request.Genero ?? "O",
                FechaNacimiento = fechaNacimiento,
                FotoPerfil = imageUrl,
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow,
                EstadoCuenta = "Activo"
            };

            await usuarioRepository.AddAsync(usuario);
            await usuarioRepository.SaveChangesAsync();

            var createdUser = usuarioRepository is UsuarioRepository usuarioRepo
                ? await usuarioRepo.GetByIdWithRelationshipsAsync(usuario.Id)
                : await usuarioRepository.GetByIdAsync(usuario.Id);

            if (createdUser == null)
            {
                logger.LogError("Failed to retrieve created user: {Email}", request.Email);
                throw new InvalidOperationException("User creation failed");
            }

            var token = GenerateJwtToken(createdUser);

            logger.LogInformation("Successful registration for user: {Email}", request.Email);

            return AuthResult.SuccessResult(new AuthResponseDto
            {
                Token = token,
                Usuario = MapToUsuarioDto(createdUser)
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
            return AuthResult.ErrorResult("Error interno del servidor", AuthErrorType.InternalError);
        }
    }

    private UsuarioDto MapToUsuarioDto(Models.Usuario usuario)
    {
        return new UsuarioDto
        {
            Id = usuario.Id,
            FotoPerfil = usuario.FotoPerfil,
            NombreUsuario = usuario.NombreUsuario,
            Email = usuario.Email,
            FechaNacimiento = usuario.FechaNacimiento,
            Genero = usuario.Genero,
            EstadoCuenta = usuario.EstadoCuenta
        };
    }

    public string GenerateJwtToken(Models.Usuario usuario)
    {
        try
        {
            var jwtSettings = configuration.GetSection("Jwt").Get<JwtSesttings>();
            if (jwtSettings?.Key == null)
            {
                throw new InvalidOperationException("JWT settings are not configured properly");
            }
            var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
            var credentials = new SigningCredentials(jwtKey, SecurityAlgorithms.HmacSha256);

            var roles = usuario.UsuariosRoles
              ?.Where(ur => ur.Activo && ur.IdRolNavigation != null)
              .Select(ur => ur.IdRolNavigation.Nombre)
              .ToList() ?? new List<string>();

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, usuario.Email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new("nombreUsuario", usuario.NombreUsuario),
                new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new(ClaimTypes.Role, string.Join(",", roles))
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
