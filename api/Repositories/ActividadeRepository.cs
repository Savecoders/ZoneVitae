using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Contexts;

namespace api.Repositories;

public class ActividadeRepository
{
    private readonly ZoneVitaeSqlContext _context;

    public ActividadeRepository(ZoneVitaeSqlContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Actividade>> GetAllAsync()
    {
        return await _context.Set<Actividade>().ToListAsync();
    }

    public async Task<Actividade?> GetByIdAsync(long id)
    {
        return await _context.Set<Actividade>().FindAsync(id);
    }

    public async Task<Actividade> AddAsync(Actividade actividade)
    {
        _context.Set<Actividade>().Add(actividade);
        await _context.SaveChangesAsync();
        return actividade;
    }

    public async Task<bool> UpdateAsync(Actividade actividade)
    {
        _context.Entry(actividade).State = EntityState.Modified;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var actividad = await _context.Set<Actividade>().FindAsync(id);
        if (actividad == null) return false;

        _context.Set<Actividade>().Remove(actividad);
        return await _context.SaveChangesAsync() > 0;
    }
}
