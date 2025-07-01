using api.Models;
using api.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Usuario
{
    public class UsuarioService(IRepository<api.Models.Usuario> usuarioRepository)
    {
        private readonly IRepository<api.Models.Usuario> _usuarioRepository = usuarioRepository;

        public Task<IEnumerable<api.Models.Usuario>> GetAllAsync() => _usuarioRepository.GetAllAsync();
        public Task<api.Models.Usuario?> GetByIdAsync(object id) => _usuarioRepository.GetByIdAsync(id);

        public async Task<api.Models.Usuario?> GetByIdWithRelationshipsAsync(object id)
        {
            // Cast to UsuarioRepository to access the specialized method
            if (_usuarioRepository is api.Repositories.UsuarioRepository usuarioRepository)
            {
                return await usuarioRepository.GetByIdWithRelationshipsAsync(id);
            }

            // Fallback to standard method if casting fails
            return await _usuarioRepository.GetByIdAsync(id);
        }
        public async Task AddAsync(api.Models.Usuario usuario)
        {
            if (!string.IsNullOrEmpty(usuario.Password))
            {
                usuario.Password = HashPassword(usuario.Password);
            }
            await _usuarioRepository.AddAsync(usuario);
            await _usuarioRepository.SaveChangesAsync();
        }
        public async Task UpdateAsync(api.Models.Usuario usuario)
        {
            _usuarioRepository.Update(usuario);
            await _usuarioRepository.SaveChangesAsync();
        }

        public async Task UpdateWithPasswordAsync(api.Models.Usuario usuario, string newPassword)
        {
            if (!string.IsNullOrEmpty(newPassword))
            {
                usuario.Password = HashPassword(newPassword);
            }
            _usuarioRepository.Update(usuario);
            await _usuarioRepository.SaveChangesAsync();
        }

        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
        public async Task DeleteAsync(api.Models.Usuario usuario)
        {
            _usuarioRepository.Delete(usuario);
            await _usuarioRepository.SaveChangesAsync();
        }
    }
}
