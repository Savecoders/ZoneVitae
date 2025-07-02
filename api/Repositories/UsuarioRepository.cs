using api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class UsuarioRepository(ZoneVitaeSqlContext _context) : IRepository<Usuario>
    {
        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(object id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        // This method retrieves users with their roles and includes related entities.
        public async Task<IEnumerable<Usuario>> FindAsync(Expression<Func<Usuario, bool>> predicate)
        {
            return await _context.Usuarios
                .Include(u => u.UsuariosRoles)
                .ThenInclude(ur => ur.IdRolNavigation)
                .Where(predicate)
                .Include(u => u.Comunidades
                )
                .ThenInclude(ur => ur.UsuariosComunidadesRoles
                )
                .ToListAsync();
        }

        public async Task<IEnumerable<Usuario>> FindWithIncludesAsync(Expression<Func<Usuario, bool>> predicate, params Expression<Func<Usuario, object>>[] includes)
        {
            IQueryable<Usuario> query = _context.Usuarios;
            
            try
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
                
                return await query.Where(predicate).ToListAsync();
            }
            catch (InvalidOperationException)
            {
                // Fallback to basic query with standard includes for Usuario
                return await _context.Usuarios
                    .Include(u => u.UsuariosRoles)
                    .ThenInclude(ur => ur.IdRolNavigation)
                    .Include(u => u.Comunidades)
                    .ThenInclude(c => c.UsuariosComunidadesRoles)
                    .Where(predicate)
                    .ToListAsync();
            }
        }

        public async Task<Usuario?> FindSingleWithIncludesAsync(Expression<Func<Usuario, bool>> predicate, params Expression<Func<Usuario, object>>[] includes)
        {
            IQueryable<Usuario> query = _context.Usuarios;
            
            try
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
                
                return await query.FirstOrDefaultAsync(predicate);
            }
            catch (InvalidOperationException)
            {
                // Fallback to basic query with standard includes for Usuario
                return await _context.Usuarios
                    .Include(u => u.UsuariosRoles)
                    .ThenInclude(ur => ur.IdRolNavigation)
                    .Include(u => u.Comunidades)
                    .ThenInclude(c => c.UsuariosComunidadesRoles)
                    .FirstOrDefaultAsync(predicate);
            }
        }

        public async Task<Usuario?> GetByIdWithIncludesAsync(object id, params Expression<Func<Usuario, object>>[] includes)
        {
            IQueryable<Usuario> query = _context.Usuarios;
            
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            
            return await query.FirstOrDefaultAsync(u => u.Id == (Guid)id);
        }

        public async Task AddAsync(Usuario entity)
        {
            await _context.Usuarios.AddAsync(entity);
        }

        public void Update(Usuario entity)
        {
            _context.Usuarios.Update(entity);
        }

        public void Delete(Usuario entity)
        {
            _context.Usuarios.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Usuario?> GetByIdWithRelationshipsAsync(object id)
        {
            return await _context.Usuarios
                .Include(u => u.Comentarios)
                .Include(u => u.Comunidades)
                .Include(u => u.ReportsNavigation)
                .Include(u => u.SeguimientoReportes)
                .Include(u => u.UsuariosComunidadesRoles)
                .ThenInclude(ucr => ucr.Rol)
                .Include(u => u.UsuariosRoles)
                .ThenInclude(ur => ur.IdRolNavigation)
                .Include(u => u.Comunidads)
                .Include(u => u.Reports)
                .FirstOrDefaultAsync(u => u.Id == (Guid)id);
        }

    }
}