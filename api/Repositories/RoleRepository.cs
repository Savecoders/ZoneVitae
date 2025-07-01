using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class RoleRepository(ZoneVitaeSqlContext context) : IRepository<Role>
    {
        private readonly ZoneVitaeSqlContext _context = context;

    public async Task<IEnumerable<Role>> GetAllAsync() => await _context.Roles.ToListAsync();
        public async Task<Role?> GetByIdAsync(object id) => await _context.Roles.FindAsync(id);
        public async Task AddAsync(Role entity) => await _context.Roles.AddAsync(entity);
        public void Update(Role entity) => _context.Roles.Update(entity);
        public void Delete(Role entity) => _context.Roles.Remove(entity);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
