using api.Models;
using api.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace api.Services.Usuario;

public class UsuarioService(IRepository<api.Models.Usuario> usuarioRepository)
{
    public Task<IEnumerable<api.Models.Usuario>> GetAllAsync() => usuarioRepository.GetAllAsync();

    public Task<api.Models.Usuario?> GetByIdAsync(object id) => usuarioRepository.GetByIdAsync(id);

    public async Task<api.Models.Usuario?> GetByEmailAsync(string email) =>
        (await usuarioRepository.FindAsync(u => u.Email.ToLower() == email.ToLower())).FirstOrDefault();

    public async Task<api.Models.Usuario?> GetByIdWithRelationshipsAsync(object id)
    {
        if (usuarioRepository is api.Repositories.UsuarioRepository usuarioRepo)
        {
            return await usuarioRepo.GetByIdWithRelationshipsAsync(id);
        }
        return await usuarioRepository.GetByIdAsync(id);
    }

    public async Task AddAsync(api.Models.Usuario usuario)
    {
        if (!string.IsNullOrEmpty(usuario.Password))
        {
            usuario.Password = HashPassword(usuario.Password);
        }
        await usuarioRepository.AddAsync(usuario);
        await usuarioRepository.SaveChangesAsync();
    }

    public async Task UpdateAsync(api.Models.Usuario usuario)
    {
        usuarioRepository.Update(usuario);
        await usuarioRepository.SaveChangesAsync();
    }

    public async Task UpdateWithPasswordAsync(api.Models.Usuario usuario, string newPassword)
    {
        if (!string.IsNullOrEmpty(newPassword))
        {
            usuario.Password = HashPassword(newPassword);
        }
        usuarioRepository.Update(usuario);
        await usuarioRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(api.Models.Usuario usuario)
    {
        usuarioRepository.Delete(usuario);
        await usuarioRepository.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(api.Models.Usuario usuario, string currentPassword, string newPassword)
    {
        // Verify current password
        string hashedCurrentPassword = HashPassword(currentPassword);
        if (usuario.Password != hashedCurrentPassword)
        {
            throw new InvalidOperationException("La contraseña actual es incorrecta");
        }

        // Update with new password
        usuario.Password = HashPassword(newPassword);
        usuario.UpdateAt = DateTime.UtcNow;

        usuarioRepository.Update(usuario);
        await usuarioRepository.SaveChangesAsync();
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
