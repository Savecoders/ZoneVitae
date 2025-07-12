using api.Config;
using api.Contexts;
using api.Contexts;
using api.Models;
using api.Services.Auth;
using api.Services.Cloudinary;
using api.Services.Comunidades;
using api.Services.Usuario;
using api.Services.Tags;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// Load environment variables from the .env file
Env.Load();

var connectionString = builder.Configuration.GetConnectionString("default") ?? "";

// Check if the connection string is empty
builder.Services.AddDbContext<ZoneVitaeSqlContext>(o => o.UseSqlServer(connectionString));

builder.Services.AddHttpContextAccessor();

// Dependency Injection for Repositories and Services
builder.Services.AddScoped<api.Repositories.IRepository<Usuario>, api.Repositories.UsuarioRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<UsuariosRole>, api.Repositories.UsuariosRoleRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<Role>, api.Repositories.RoleRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<Comunidade>, api.Repositories.ComunidadeRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<Tag>, api.Repositories.TagRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<Comentario>, api.Repositories.ComentarioRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<Foto>, api.Repositories.FotoRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<GaleriaComunidad>, api.Repositories.GaleriaComunidadRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<UsuariosComunidadesRole>, api.Repositories.UsuariosComunidadesRolesRepository>();
builder.Services.AddScoped<api.Repositories.IRepository<RolesComunidade>, api.Repositories.RolesComunidadesRepository>();
// builder.Services.AddScoped<api.Repositories.IRepository<api.Models.SeguimientoReporte>, api.Repositories.ReportRepository>();


// Dependency Injection for AuthService
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<ComunidadService>();
builder.Services.AddScoped<TagService>();


// Add controllers with JSON options
// This is necessary to ensure that the API uses System.Text.Json for serialization
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        corsPolicyBuilder => corsPolicyBuilder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>

{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ZoneVitae API",
        Version = "v1",
        Description = "API for the ZoneVitae community Iesses platform"
    });

    // Add JWT Authentication support to Swagger UI
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



// Authentication and Authorization Configuration
// JWT Authentication
// Docs https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication?view=aspnetcore-9.0
// please guys not changes this file

// App.Settings configuration or environment variables
builder.Services.Configure<JwtSesttings>(
    builder.Configuration.GetSection("Jwt")
);

// Development environment variables

var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSesttings>();

var jwtKey = Encoding.UTF8.GetBytes(jwtSettings?.Key ?? "");

// Deployment environment variables
// Using DontEnv to load environment variables from a .env file

// jwtSettings = new JwtSesttings()
// {
//     Key = Env.GetString("JWT_SECRET_KEY"),
//     Issuer = Env.GetString("JWT_ISSUER"),
//     Audience = Env.GetString("JWT_AUDIENCE"),
//     ExpirationInMinutes = Env.GetInt("JWT_EXPIRATION_IN_MINUTES", 4320) // Default to 4320 minutes if not set
// };


if (string.IsNullOrEmpty(jwtSettings?.Audience) || string.IsNullOrEmpty(jwtSettings.Issuer))
{
    throw new InvalidOperationException("JWT configuration is missing. Please.json or environment variables.");
}

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
            RequireExpirationTime = true,
            ValidateTokenReplay = false,
        };
        options.MapInboundClaims = false; // Do not map claims from the token to the user principal
    });

builder.Services.AddAuthorization(options =>
{
    // Defailt policy for authenticated users
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
         .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
         .RequireAuthenticatedUser()
         .Build();

    // Add policies for specific roles if needed
    // Roles => "Administrador", "Moderador", "Usuario"
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ZoneVitae API v1");
        options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
        options.DefaultModelsExpandDepth(0); // Hide the schemas section
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
