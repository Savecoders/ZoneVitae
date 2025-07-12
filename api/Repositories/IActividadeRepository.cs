// Interfaces/IActividadeRepository.cs
using api.Models;

public interface IActividadeRepository
{
    Task<IEnumerable<Actividade>> GetAllAsync();
    Task<Actividade?> GetByIdAsync(long id);
    Task<Actividade> AddAsync(Actividade actividade);
    Task<bool> UpdateAsync(Actividade actividade);
    Task<bool> DeleteAsync(long id);
}
